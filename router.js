const express=require('express')
const router=express.Router()
const conexion=require('./database/db')



router.get('/',(req,res)=>{
    res.render('index')
})
router.get('/create', (req, res) => {
    const buscar = req.query.buscar;

    // Verifica si hay un valor en el campo de búsqueda
    if (buscar) {
        // Si hay un valor, realiza la consulta con filtro
        conexion.query(`SELECT * FROM empleados WHERE departamento LIKE '%${buscar}%'`, (err, resultados) => {
            if (err) {
                throw err;
            } else {
                res.render('create', { resultados: resultados, buscar: buscar });
            }
        });
    } else {
        // Si no hay un valor, muestra todos los empleados
        conexion.query('SELECT * FROM empleados', (err, resultados) => {
            if (err) {
                throw err;
            } else {
                res.render('create', { resultados: resultados });
            }
        });
    }
});
router.post('/create', (req, res) => {
    res.redirect('/create');
});
const crud=require('./controllers/crud')
router.post('/store',crud.save)
router.get('/tareas',(req,res)=>{
    conexion.query('SELECT * FROM empleados',(err,resultados)=>{
        if(err)
        throw err
    else
    res.render('tareas',{resultados:resultados})
    })
})
router.post('/tareasfinal',crud.tareaxs)
router.get('/tareasmessage',(req,res)=>{
    res.render('tareasfin')

})
router.get('/total', (req, res) => {
    // Consultar total en dólares de salarios pagados por fecha de contratación
    const consultaTotalSalariosPorFecha = `
      SELECT fechaContratacion, SUM(salario) as totalSalarios
      FROM empleados
      WHERE pagado = 1
      GROUP BY fechaContratacion
      ORDER BY fechaContratacion
    `;
  
    conexion.query(consultaTotalSalariosPorFecha, (err, empleadosPorFecha) => {
      if (err) {
        console.error('Error al consultar salarios por fecha: ' + err.stack);
        return res.status(500).send('Error en el servidor');
      }
  
      // Consultar el total general en dólares de salarios pagados
      const consultaTotalSalariosGeneral = `
        SELECT SUM(salario) as totalSalariosGeneral
        FROM empleados
        WHERE pagado = 1
      `;
  
      conexion.query(consultaTotalSalariosGeneral, (err, resultadoTotalSalarios) => {
        if (err) {
          console.error('Error al consultar total general de salarios: ' + err.stack);
          return res.status(500).send('Error en el servidor');
        }
  
        const totalSalariosGeneral = resultadoTotalSalarios[0].totalSalariosGeneral;
  
        // Renderizar la vista con los datos
        res.render('total', { empleadosPorFecha, totalSalariosGeneral });
      });
    });
  });
  

/*router.get('/',(req,res)=>{
    conexion.query('SELECT * FROM usuario',(err,resultados)=>{
        if(err)
        throw err
    else
    res.render('index',{resultados:resultados})

    })

})

const crud=require('./controllers/crud')
router.post('/store',crud.save)

router.get('/create',(req,res)=>{
    res.render('create')

})

router.get('/edit/:id',(req,res)=>{
    const id =req.params.id
    conexion.query('SELECT * FROM usuario WHERE id=?',[id],(err,resultados)=>{
        if(err)
        throw err
    else{
    res.render('edit',{usuario:resultados[0]})
    }
    })
})
router.post('/update',crud.update)

router.get('/eliminar/:id',(req,res)=>{
    const id=req.params.id
    conexion.query('DELETE FROM usuario WHERE id=?',[id],(err,resultados)=>{
        if(err)
        throw err
    else
    res.redirect('/')
    })

})*/
module.exports=router