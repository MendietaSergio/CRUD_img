import React,{Fragment, useState, useEffect} from 'react';
import Modal from 'react-modal';

function App() {

  const [file, setfile] = useState(null)//para guardar una imagen y limpiar el imput
  const [imageList, setImageList] = useState([])//para mostrar las imagenes desde el servidor
  const [listUpdated, setListUpdated] = useState(false)//para saber cuando se actualizan las imagenes
  const [modalListOpen, setModalListOpen] = useState(false)//para que el modal este cerrado se empieza en 'false'
  const [currentImage, setCurrentImage] = useState(null)//Para setear img en modal



  const selectedHandler = e =>{
    setfile(e.target.files[0]);//agrego el archivo en el estado
  }
  //para consultar la base de datos del servidor
  useEffect(()=>{
    Modal.setAppElement('body')//setear el elemento seteado
    fetch('http://localhost:9000/image/get')
      .then(res => res.json())
      .then(res => setImageList(res))
      .catch(error => {
        console.log(error)
      })
      setListUpdated(false)
  },[listUpdated])
  const sendHandler = ()=>{
    if(!file){
      alert("You must upload file.")
      return
    }
    const formdata = new FormData()
    formdata.append("image",file)

    fetch('http://localhost:9000/image/post', {
      method: 'POST',
      body: formdata
    })
      .then(res => res.text())
      .then(res => {
        console.log(res)
        setListUpdated(true)//para actualizar y mostrar la imagen recien cargada
        })
      .catch(error => {
        console.log(error)
      })
    document.getElementById('fileInput').value=null;
      setfile(null)//para que se limpie
  }
  const modalHandler = (isOpen,image)=>{
    setModalListOpen(isOpen)//seteo el estado de modal
    setCurrentImage(image)
  }
  const deleteHandler = ()=>{
    let imageID = currentImage.split('_')//separo solo el numero.
    console.log(imageID[0]);
    imageID =parseInt(imageID[0])//paso de string a entero.
    fetch('http://localhost:9000/image/delete/'+imageID,{
      method:"DELETE"
    })
    .then(res => res.text())
    .then(res => console.log(res));
    setModalListOpen(false);//para que cierre el modal antes de actualizar la página
    setListUpdated(true);//para actualizar la página con las imagenes que quedan.

  }
  return (
    // para exportar multiples elementos html
    <Fragment>
      <nav className="navbar navbar-dark bg-dark">
        <div className="container">
          <a href="/" className="navbar-brand">Image App</a>
        </div>
      </nav>
      <div className="container mt-5">
        <div className="card p-3">
          <div className="row">
            <div className="col-10">
              <input id="fileInput" onChange={selectedHandler} className="form-control" type="file"/>
            </div>
            <div className="col-2">
              <button onClick={sendHandler} type="button" className="btn btn-primary col-12">Upload</button>
            </div>
          </div>          
            
        </div>
      </div>
      <div className="container mt-3" style={{display:"flex", flexWrap:"wrap"}}>
        {/* para mostrar cada imagen que tiene el array */}
      {imageList.map(image =>(
        <div key={image} className="card m-2">
          <img src={"http://localhost:9000/" + image} alt="" className="card-img-top" style={{height:"200px", width:"200px"}}/>
          <div className="card-body">
            <button className="btn btn-dark"  onClick={()=> modalHandler(true, image)}>Click to view</button>
          </div>
        </div>
      ))}
      </div>
      {/* Modal es la ventana emergente, isOpen modalListOpen es lo que contiene la variable 'true' para que se vea la venta.
      Para cerrar la ventana se usa onRequestClose, cuando hacen click por fuera de la ventana se cierra la ventana emergente */}
      <Modal style={{content:{right:"20%", left:"20%", height:"auto", width:"auto"}}} isOpen={modalListOpen} onRequestClose={()=>modalHandler(false, null)}> 
        <div className="card">
          <img src={"http://localhost:9000/" + currentImage} alt=""/>
          <div className="card-body">
            <button className="btn btn-danger" onClick={()=> deleteHandler()}>Delete</button>
          </div>
        </div>
      </Modal>
    </Fragment>
  );
}

export default App;
