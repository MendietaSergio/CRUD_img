import React,{Fragment, useState} from 'react';


function App() {

  const [file, setfile] = useState(null)
  const selectedHandler = e =>{
    setfile(e.target.files[0]);//agrego el archivo en el estado
  }
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
      .then(res => console.log(res))
      .catch(error => {
        console.log(error)
      })
    document.getElementById('fileInput').value=null;
      setfile(null)//para que se limpie
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
    </Fragment>
  );
}

export default App;
