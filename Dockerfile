# Sử dụng hình ảnh Node.js chính thức để build ứng dụng Angular
FROM node:18.16.0 AS build

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép file package.json và package-lock.json vào thư mục làm việc
COPY package*.json ./

# Cài đặt các dependencies của ứng dụng
RUN npm install --force

# Sao chép toàn bộ mã nguồn vào thư mục làm việc
COPY . .

# Build ứng dụng Angular
RUN npm run build --prod

# Sử dụng hình ảnh Nginx chính thức để phục vụ ứng dụng
FROM nginx:alpine

# Xoá file mặc định của Nginx
RUN rm -rf /usr/share/nginx/html/*

# Sao chép các file đã build từ giai đoạn trước vào thư mục phục vụ của Nginx
COPY --from=build /app/dist/ecommerce-web /usr/share/nginx/html

# Tạo thư mục cho chứng chỉ SSL
RUN mkdir -p /etc/nginx/ssl

# Sao chép chứng chỉ SSL vào container
COPY /ssl/hopnv.xyz.crt /etc/nginx/ssl/hopnv.xyz.crt
COPY /ssl/www_hopnv_xyz.key /etc/nginx/ssl/www_hopnv_xyz.key

# Sao chép file cấu hình Nginx vào container
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Mở cổng 80 để truy cập ứng dụng
EXPOSE 80

# Khởi chạy Nginx
CMD ["nginx", "-g", "daemon off;"]
