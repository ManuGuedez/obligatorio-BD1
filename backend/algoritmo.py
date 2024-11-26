from datetime import datetime, timedelta, date

# devuelve una lista con las tuplas en formato (fecha, día_semana)
def generar_calendario(start_date, end_date, dias_clase): #start_date, end_date, dias_clase ----> para agregar en el parametro
    
    # Las fechas entran en formato Y/M/D y salen en formato Y/M/D
     
    for i in range(len(dias_clase)):
        dias_clase[i] = dias_clase[i] - 1 # Días de clase: lunes (0), martes (1), miércoles (2), jueves (3) , viernes (4) = 5 dias
    
    dias_semana_español = {
    "Monday": "lunes",
    "Tuesday": "martes",
    "Wednesday": "miercoles",
    "Thursday": "jueves",
    "Friday": "viernes"
    }
    
    # Convertir las fechas a formato datetime
    start = datetime.strptime(start_date, "%Y-%m-%d")
    end = datetime.strptime(end_date, "%Y-%m-%d")

    # Lista para guardar los días de clase con sus nombres de día
    dias_marcados = []

    # Bucle para recorrer cada día en el rango
    dia_actual = start
    while dia_actual <= end:
        if dia_actual.weekday() in dias_clase:
            nombre_dia = dia_actual.strftime("%A")  # Día en inglés
            dia_español = dias_semana_español.get(nombre_dia)
            fecha = (f"{dia_actual.strftime('%Y-%m-%d')}", dia_español)
            dias_marcados.append(fecha)
        dia_actual += timedelta(days=1)


        
    return dias_marcados