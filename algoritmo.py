from datetime import datetime, timedelta, time

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


    print("Días en los que se dicta clase en noviembre de 2024:")
    # for dia in dias_marcados:
        # print(dia)

        
    return dias_marcados

days = {
    'lunes': 1,
    'martes': 2,
    'miercoles': 3
}

# fechas = generar_calendario("2024-11-11" ,  "2024-12-11", [1, 3])
# session_values = ""
# class_id = 1
# for fecha in fechas:
#         id_dia = days.get(fecha[1])
#         session_values += f"({str(class_id)}, \'{fecha[0]}\', {str(id_dia)}),"
# session_values = session_values[:-1]

# print(session_values)

print('('+ str([1, 2, 3, 4])[1:-1] + ')')
