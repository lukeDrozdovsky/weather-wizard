# Używamy oficjalnego obrazu Node.js (wersja Alpine dla mniejszego rozmiaru)
FROM node:16-alpine

# Ustawiamy katalog roboczy wewnątrz kontenera
WORKDIR /app

# Kopiujemy pliki package.json i package-lock.json (jeśli istnieje)
COPY package*.json ./

# Instalujemy zależności
RUN npm install
RUN npm install nodemon

# Kopiujemy resztę kodu aplikacji
COPY . .

# Otwieramy port, na którym aplikacja będzie nasłuchiwać (np. 3000)
EXPOSE 3000

# Definiujemy polecenie uruchamiające aplikację
CMD ["npm", "start"]
