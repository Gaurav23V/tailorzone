# TailorZone E-commerce Platform

TailorZone is a modern, full-stack e-commerce platform built with Next.js, Node.js, and MongoDB. It provides a seamless shopping experience with features like user authentication, product management, cart functionality, and secure payment processing.

![TailorZone Demo](https://res.cloudinary.com/dnjbvrono/image/upload/v1734949118/uo8t1bef5iq5g9rsmp7k.png)

## 🌟 Features

- **User Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (User/Admin)
  - Password reset functionality
  - Social login integration

- **Product Management**
  - Advanced product search and filtering
  - Category management
  - Product ratings and reviews
  - Image optimization and management

- **Shopping Experience**
  - Real-time cart updates
  - Wishlist functionality
  - Order tracking
  - Responsive design for all devices

- **Checkout & Payments**
  - Secure payment processing
  - Multiple payment methods
  - Order confirmation emails
  - Address management

- **Admin Dashboard**
  - Product inventory management
  - Order management
  - User management
  - Analytics and reporting

## 🚀 Tech Stack

### Frontend
- Next.js
- TypeScript
- Tailwind CSS
- Framer Motion
- Zustand (State Management)

### Backend
- Node.js
- Express.js
- MongoDB
- Redis (Caching)
- JWT Authentication

## 📸 Screenshots

<div align="center">
  <img src="https://res.cloudinary.com/dnjbvrono/image/upload/v1734949307/o4tcinugltavpbnlwa0q.png" alt="Home Page" width="45%">
  <img src="https://res.cloudinary.com/dnjbvrono/image/upload/v1734949217/bdd7wjovjwmd1wgcwpvg.png" alt="Products Page" width="45%">
</div>

<div align="center">
  <img src="https://res.cloudinary.com/dnjbvrono/image/upload/v1734949380/nsggofrvr47eoqtoihm0.png" alt="Cart Page" width="45%">
  <img src="https://res.cloudinary.com/dnjbvrono/image/upload/v1734949430/ayxvrzff4dbakhrtlp8l.png" alt="Checkout Page" width="45%">
</div>

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/tailorzone.git
```

2. Install dependencies for both frontend and backend:
```bash
# Frontend
cd frontend
npm install

# Backend
cd backend
npm install
```

3. Set up environment variables:
```bash
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your_stripe_public_key

# Backend (.env)
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
```

4. Run the development servers:
```bash
# Frontend
npm run dev

# Backend
npm run dev
```

## 📝 API Documentation

The API documentation is available at `/api-docs` when running the development server. It includes detailed information about all available endpoints, request/response formats, and authentication requirements.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌐 Live Demo

Check out our live demo at [https://tailorzone.com](https://tailorzone.com)

## 📞 Support

For support, email support@tailorzone.com or join our Slack channel.
