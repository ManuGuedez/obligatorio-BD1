def add_class(instructor_ci, activity_id, turn_id, start_date, end_date, days_ids):
    try:
        if not cnx.in_transaction:
            cnx.start_transaction() # declaro el inicio de una transacción 
            
            insert = 'INSERT INTO classes (instructor_ci, activity_id, turn_id, start_date, end_date) VALUE (%s, %s, %s, %s, %s)'
            
            cursor.execute(insert, (instructor_ci, activity_id, turn_id, start_date, end_date))
            class_id = cursor.lastrowid # obtiene el id de la clase recién insertada
        
            # inserta los días de las clases 
            insert_days = "INSERT INTO class_day (class_id, day_id) VALUES "
            days_values = ""
            for i in days_ids:
                days_values += f"({str(class_id)}, {str(i)}),"
            
            days_values = days_values[:-1]
            
            insert_days = insert_days + days_values
            cursor.execute(insert_days)
            
            # insertar las fechas en las que se debe dictar
            fechas = algoritmo.generar_calendario(start_date, end_date, days_ids)    
            # insert_session  = "INSERT INTO class_session (class_id, class_date, day_id) VALUES " 
            # days = get_days()
            insert_session = "INSERT INTO class_session (class_id, class_date, day_id) VALUES (%s, %s, %s)" # por defecto se establece como no dictada
            days = get_days()
            session_values = [(class_id, fecha[0], days.get(fecha[1])) for fecha in fechas]
            cursor.executemany(insert_session, session_values)
            
            cnx.commit()  
            
            return 1, "Nueva clase creada exitosamente."   
        else:
            return -1, " hay algo corriendo"     
    except mysql.Error as err:
        
        # en caso de error se revierte la transacción
        cnx.rollback()
        return -1, f"Error al crear la clase: {fechas[0][0]}"