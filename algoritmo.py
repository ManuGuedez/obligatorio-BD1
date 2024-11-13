import mysql.connector as mysql

cnx = mysql.connect(user='root', password='rootpassword', host='127.0.0.1', database='snowSchool')
cursor = cnx.cursor(dictionary=True) # devuelve la info en formato key-value

from datetime import datetime, timedelta

def generar_calendario(): #start_date, end_date, dias_clase ----> para agregar en el parametro
    
    # Las fechas entran en formato Y/M/D y salen en formato D/M/Y
    
    start_date = "2024-11-11"  # Fecha de inicio en noviembre 2024
    end_date = "2024-12-15"    # Fecha de fin en noviembre 2024
    dias_clase = [0, 2, 4]     # Días de clase: lunes (0), martes (1), miércoles (2), jueves (3) , viernes (4) = 5 dias
    
    
    # Convertir las fechas a formato datetime
    start = datetime.strptime(start_date, "%Y-%m-%d")
    end = datetime.strptime(end_date, "%Y-%m-%d")

    # Lista para guardar los días de clase con sus nombres de día
    dias_marcados = []

    # Bucle para recorrer cada día en el rango
    dia_actual = start
    while dia_actual <= end:
        if dia_actual.weekday() in dias_clase:
            dias_marcados.append(f"{dia_actual.strftime('%d-%m-%Y')} - {dia_actual.strftime('%A')}")
        dia_actual += timedelta(days=1)


    print("Días en los que se dicta clase en noviembre de 2024:")
    for dia in dias_marcados:
        print(dia)


generar_calendario()