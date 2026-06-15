# שוברים שוק — Storefront (Next.js 14)
# Multi-stage: build ואז הרצה עם next start.

# ---------- שלב build ----------
FROM node:20-bookworm-slim AS build
WORKDIR /app

# משתני NEXT_PUBLIC_* "נצרבים" לתוך ה-bundle בזמן build — לכן הם build args.
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_CLOUDINARY_URL
ARG NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID
ARG NEXT_PUBLIC_TERMINAL_NUMBER
ARG NEXT_PUBLIC_STORE_DOMAIN
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL \
    NEXT_PUBLIC_CLOUDINARY_URL=$NEXT_PUBLIC_CLOUDINARY_URL \
    NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=$NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET \
    NEXT_PUBLIC_GOOGLE_CLIENT_ID=$NEXT_PUBLIC_GOOGLE_CLIENT_ID \
    NEXT_PUBLIC_TERMINAL_NUMBER=$NEXT_PUBLIC_TERMINAL_NUMBER \
    NEXT_PUBLIC_STORE_DOMAIN=$NEXT_PUBLIC_STORE_DOMAIN

COPY package*.json ./
# המחשב הבונה נמצא מאחורי proxy עם TLS interception ("unable to get local issuer
# certificate"). מאפשרים ל-sharp@0.32 להוריד את libvips. רלוונטי לשלב ה-build בלבד.
RUN NODE_TLS_REJECT_UNAUTHORIZED=0 npm_config_strict_ssl=false npm ci

COPY . .
RUN npm run build

# ---------- שלב run ----------
FROM node:20-bookworm-slim AS run
WORKDIR /app
ENV NODE_ENV=production \
    PORT=3000

# מעתיקים את כל ה-app הבנוי (כולל node_modules, .next, public, locales, next.config.js).
# העתקה מלאה נמנעת מבעיות עם next-pwa / next-translate / sharp בזמן ריצה.
COPY --from=build /app ./

USER node
EXPOSE 3000
CMD ["npm", "start"]
