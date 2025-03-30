# ใช้ Node.js base image
FROM node:18-alpine

# ตั้ง working directory
WORKDIR /app

# คัดลอกไฟล์ package.json และ package-lock.json
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install

# คัดลอก source code ทั้งหมดไปยัง container
COPY . .

# สร้าง Next.js app
RUN npm run build

# เปิด port ที่แอปพลิเคชันจะฟัง (3000)
EXPOSE 3000

# คำสั่งเริ่มต้นเพื่อรันแอป
CMD ["npm", "start"]
