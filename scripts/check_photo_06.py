import cv2

im = cv2.imread("public/processed_reel_assets/photo_06.jpg")
crop = im[450:1150, 360:720]
cv2.imwrite("public/photo_06_blemish_check.jpg", crop)
print("Saved photo_06_blemish_check.jpg")
