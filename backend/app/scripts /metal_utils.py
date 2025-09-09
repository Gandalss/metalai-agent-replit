import cv2
import numpy as np


def load_and_scale_image(image_path: str, scale_percent: int = 100) -> np.ndarray:
    """Load an image from *image_path* and scale it by *scale_percent*."""
    image = cv2.imread(image_path)
    if image is None:
        raise FileNotFoundError(f"Bild nicht gefunden: {image_path}")
    width = int(image.shape[1] * scale_percent / 100)
    height = int(image.shape[0] * scale_percent / 100)
    return cv2.resize(image, (width, height), interpolation=cv2.INTER_AREA)


def enhance_grid_detection(img: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
    """Return edges and grayscale image with enhanced contrast."""
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    gray = clahe.apply(gray)
    edges = cv2.Canny(gray, 30, 150, apertureSize=3)
    kernel = np.ones((3, 3), np.uint8)
    edges = cv2.dilate(edges, kernel, iterations=1)
    edges = cv2.erode(edges, kernel, iterations=1)
    return edges, gray


def compute_homography(resized: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
    """Compute homography to unwarp the grid in *resized*."""
    edges, _ = enhance_grid_detection(resized)
    contours, _ = cv2.findContours(edges, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
    if not contours:
        raise ValueError("Keine Konturen für Homographie gefunden.")

    cnt = max(contours, key=cv2.contourArea)
    epsilon = 0.02 * cv2.arcLength(cnt, True)
    approx = cv2.approxPolyDP(cnt, epsilon, True)

    if len(approx) == 4:
        pts = approx.reshape(4, 2).astype(np.float32)

        def order_points(pts: np.ndarray) -> np.ndarray:
            rect = np.zeros((4, 2), np.float32)
            s = pts.sum(axis=1)
            rect[0] = pts[np.argmin(s)]
            rect[2] = pts[np.argmax(s)]
            diff = np.diff(pts, axis=1)
            rect[1] = pts[np.argmin(diff)]
            rect[3] = pts[np.argmax(diff)]
            return rect

        rect = order_points(pts)
        tl, tr, br, bl = rect
        wA = np.linalg.norm(br - bl)
        wB = np.linalg.norm(tr - tl)
        hA = np.linalg.norm(tr - br)
        hB = np.linalg.norm(tl - bl)
        maxW, maxH = int(max(wA, wB)), int(max(hA, hB))
        aspect_ratio = maxW / maxH
        if not (0.8 <= aspect_ratio <= 1.2):
            print(f"Warnung: Ungewöhnliches Seitenverhältnis {aspect_ratio:.2f}, überprüfe Homographie")
        dst = np.array([[0, 0], [maxW - 1, 0], [maxW - 1, maxH - 1], [0, maxH - 1]], np.float32)
        M = cv2.getPerspectiveTransform(rect, dst)
        warped = cv2.warpPerspective(resized, M, (maxW, maxH))
        return warped, M
    print("Warnung: Kein 4-Ecken-Rechteck gefunden, benutze Originalbild für Kalibrierung.")
    return resized.copy(), np.eye(3)


def detect_grid_cells(img: np.ndarray):
    g = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    edges_results = []
    for low_thresh in [30, 50, 70]:
        for high_thresh in [100, 150, 200]:
            edges = cv2.Canny(g, low_thresh, high_thresh, apertureSize=3)
            edges_results.append(edges)
    combined_edges = np.zeros_like(edges_results[0])
    for edge in edges_results:
        combined_edges = cv2.bitwise_or(combined_edges, edge)
    all_lines = []
    for minLineLength in [80, 100, 120]:
        for maxLineGap in [5, 10, 15]:
            lines = cv2.HoughLinesP(combined_edges, 1, np.pi / 180,
                                    threshold=100, minLineLength=minLineLength,
                                    maxLineGap=maxLineGap)
            if lines is not None:
                all_lines.extend(lines)
    if not all_lines:
        raise ValueError("Keine Rasterlinien gefunden.")
    horizontal_lines = []
    vertical_lines = []
    for line in all_lines:
        x1, y1, x2, y2 = line[0]
        if abs(x1 - x2) < 15:
            vertical_lines.append(line[0])
        elif abs(y1 - y2) < 15:
            horizontal_lines.append(line[0])
    return vertical_lines, horizontal_lines, combined_edges


def cluster_coords(coords: list[int], tol: int = 10) -> list[int]:
    """Cluster sorted coordinate list using an adaptive tolerance."""
    if not coords:
        return []
    sorted_coords = sorted(coords)
    if len(sorted_coords) > 1:
        avg_diff = np.mean(np.diff(sorted_coords))
        tol = min(max(tol, avg_diff * 0.4), 20)
    clusters = []
    for c in sorted_coords:
        if not clusters or c - clusters[-1][-1] > tol:
            clusters.append([c])
        else:
            clusters[-1].append(c)
    return [int(np.mean(cl)) for cl in clusters]


def calibrate_grid(warped: np.ndarray, tol: int = 10):
    vertical_lines, horizontal_lines, _ = detect_grid_cells(warped)
    vert_x = [x for x1, y1, x2, y2 in vertical_lines for x in (x1, x2)]
    horiz_y = [y for x1, y1, x2, y2 in horizontal_lines for y in (y1, y2)]
    xs = cluster_coords(vert_x, tol)
    ys = cluster_coords(horiz_y, tol)
    x_deltas = np.diff(xs)
    x_deltas = x_deltas[x_deltas > 20]
    y_deltas = np.diff(ys)
    y_deltas = y_deltas[y_deltas > 20]
    if len(x_deltas) == 0 or len(y_deltas) == 0:
        raise ValueError("Unzureichende Linienabstände für Kalibrierung.")
    px_per_cm_x = float(np.median(x_deltas))
    px_per_cm_y = float(np.median(y_deltas))
    grid_ratio = px_per_cm_x / px_per_cm_y
    if not (0.9 <= grid_ratio <= 1.1):
        print(f"Warnung: Gitter könnte verzerrt sein! X/Y-Verhältnis: {grid_ratio:.2f}")
    px_per_cm = (px_per_cm_x + px_per_cm_y) / 2
    return px_per_cm, px_per_cm_x, px_per_cm_y, xs, ys
