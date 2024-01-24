const conexion=require('../database/db')
exports.save=(req,res)=>{
    const nombre=req.body.nombre
    const fechaContratacion=req.body.fechaContratacion
    const salario=req.body.salario
    const horasTrabajadas=req.body.horasTrabajadas
    const departamento=req.body.departamento
const pagado= Math.round(Math.random())
if (!nombre || !fechaContratacion || !salario || !horasTrabajadas || !departamento) {
    return res.status(400).send('Todos los campos son obligatorios.');
}
    conexion.query('INSERT INTO empleados SET ?',{nombre:nombre,fechaContratacion:fechaContratacion,salario:salario,horasTrabajadas:horasTrabajadas,departamento:departamento},(err,results)=>{
        if(err)
        throw err
    else
    res.redirect('/create')
    })
}


exports.tareaxs = (req, res) => {
    const { id_empleado, horas } = req.body;

    const consultaEmpleado = 'SELECT horasTrabajadas FROM empleados WHERE id = ?';

    conexion.query(consultaEmpleado, [id_empleado], (err, resultadosEmpleado) => {
        if (err) {
            console.log(err);
            return res.redirect('/index');
        }

        const horasTrabajadas = resultadosEmpleado[0].horasTrabajadas;

        if (horasTrabajadas < horas) {
          const flash=   'Las horas de tarea no pueden ser mayores a las horas trabajadas.';
            return res.render('tareasfin',{flash});
        } else {
            const nuevaTarea = {
                nombre: req.body.nombre,
                horas: req.body.horas,
                id_empleado: req.body.id_empleado
            };
            const consultaInsertarTarea = 'INSERT INTO tareas SET ?';

            conexion.query(consultaInsertarTarea, nuevaTarea, (err) => {
                if (err) {
                    console.log(err);
                    req.flash('failMessage', 'Error en el servidor');
                    return res.redirect('/index');
                }
                   
               // req.flash('successMessage', 'Tarea creada exitosamente.');
                return res.redirect('/create');
               
                
            });
               
    }
});
};