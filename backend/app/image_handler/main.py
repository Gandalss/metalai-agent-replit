import os
import subprocess
import re

SCRIPT_DIR = os.path.join(os.path.dirname(__file__), "..", "scripts ")


def _run_script(script_name: str, image_path: str) -> str:
    script_path = os.path.join(SCRIPT_DIR, script_name)
    result = subprocess.run([
        "python",
        script_path,
        image_path,
    ], cwd=SCRIPT_DIR, capture_output=True, text=True)
    if result.returncode != 0:
        raise RuntimeError(result.stderr)
    return result.stdout


def _parse_value(pattern: str, text: str) -> float | None:
    match = re.search(pattern, text)
    if match:
        try:
            return float(match.group(1))
        except ValueError:
            return None
    return None



def process_images(image_bottom: str, image_side: str) -> dict:
    """Run measurement scripts on two images and return results in mm."""
    # First image: bottom view used for width and height
    output_bottom = _run_script("Main7BottomWidthBETTER.py", image_bottom)
    width_cm = _parse_value(r"Finale Unterseiten-Breite: ([0-9.]+)", output_bottom)
    if width_cm is None:
        width_cm = _parse_value(r"Finale Breite unten: ([0-9.]+)", output_bottom)
    height_cm = _parse_value(r"Finale H\xe0he: ([0-9.]+)", output_bottom)
    if height_cm is None:
        height_cm = _parse_value(r"Finale H\xc3\xb6he: ([0-9.]+)", output_bottom)
        if height_cm is None:
            height_cm = _parse_value(r"Finale Höhe: ([0-9.]+)", output_bottom)

    # Second image: side view used for depth measurement
    output_side = _run_script("Main7BottomWidthBETTER.py", image_side)
    depth_cm = _parse_value(r"Finale Unterseiten-Breite: ([0-9.]+)", output_side)
    if depth_cm is None:
        depth_cm = _parse_value(r"Finale Breite unten: ([0-9.]+)", output_side)

    return {
        "width": width_cm * 10 if width_cm is not None else None,
        "height": height_cm * 10 if height_cm is not None else None,
        "depth": depth_cm * 10 if depth_cm is not None else None,
    }


def process_ground_images(image_front: str, image_side: str) -> dict:
    """Run measurement scripts for ground level capture."""
    output_length = _run_script("Main2Bottom.py", image_front)
    length_cm = _parse_value(r"Finale Unterseiten-Breite: ([0-9.]+)", output_length)
    if length_cm is None:
        length_cm = _parse_value(r"Finale Breite unten: ([0-9.]+)", output_length)

    output_height = _run_script("Main4High.py", image_front)
    height_cm = _parse_value(r"Finale H\xe0he: ([0-9.]+)", output_height)
    if height_cm is None:
        height_cm = _parse_value(r"Finale H\xc3\xb6he: ([0-9.]+)", output_height)
        if height_cm is None:
            height_cm = _parse_value(r"Finale H\xf6he: ([0-9.]+)", output_height)
            if height_cm is None:
                height_cm = _parse_value(r"Finale Höhe: ([0-9.]+)", output_height)

    output_width = _run_script("Main7BottomWidthBETTER.py", image_side)
    width_cm = _parse_value(r"Finale Unterseiten-Breite: ([0-9.]+)", output_width)
    if width_cm is None:
        width_cm = _parse_value(r"Finale Breite unten: ([0-9.]+)", output_width)

    return {
        "length": length_cm * 10 if length_cm is not None else None,
        "height": height_cm * 10 if height_cm is not None else None,
        "width": width_cm * 10 if width_cm is not None else None,
    }



def process_image(image):
    # Kept for backward compatibility
    return {"message": "Image processed successfully!"}
