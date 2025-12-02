from PIL import Image
import os
import glob

def remove_white_background(image_path, threshold=240):
    try:
        img = Image.open(image_path)
        img = img.convert("RGBA")
        datas = img.getdata()

        new_data = []
        for item in datas:
            # Check if pixel is close to white
            if item[0] > threshold and item[1] > threshold and item[2] > threshold:
                new_data.append((255, 255, 255, 0))  # Transparent
            else:
                new_data.append(item)

        img.putdata(new_data)
        img.save(image_path, "PNG")
        print(f"Processed: {image_path}")
    except Exception as e:
        print(f"Error processing {image_path}: {e}")

# Target directory
target_dir = r"e:\downloads_E\me_1125\sound-novel-game\src\assets\images\characters"

# Process all PNGs in the directory
for file_path in glob.glob(os.path.join(target_dir, "*.png")):
    remove_white_background(file_path)
