# Usar Python 3.10 como base
FROM python:3.10-slim

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos necesarios
COPY requirements.txt /app/

# Instalar las dependencias
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el resto del proyecto
COPY . /app

# Exponer el puerto
EXPOSE 5000

# Comando para ejecutar el backend
CMD ["python", "app.py"]
