import cv2

im = cv2.imread("public/processed_reel_assets/photo_02.jpg")
# In photo 02, the face is in upper middle
# Let's crop central face: y: 300 to 750, x: 380 to 700
crop = im[320:680, 420:660]
cv2.imwrite("public/nose_region_sample2.jpg", crop)
print("Saved nose_region_sample2.jpg")
