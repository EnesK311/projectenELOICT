# Gebruik de officiële Nginx-image van Docker Hub als basis
FROM nginx:alpine

# Stel de werkdirectory in de container in
WORKDIR /usr/share/nginx/html

# Verwijder standaardbestanden van Nginx
RUN rm -rf ./*

# Kopieer de gecompileerde Vue.js-build naar de container
COPY dist-build/ .

# Kopieer de aangepaste nginx.conf naar de Nginx-configuratiemap
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposeer poort 8080 (vereist door Google Cloud Run)
EXPOSE 8080

# Start Nginx in de voorgrond
CMD ["nginx", "-g", "daemon off;"]