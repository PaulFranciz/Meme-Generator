import "./header.css"
import logoImage from "/public/Untitled design (7).png"

const Header = () =>{

    
return(
     <>
       <div className="Header--Container">
         <div className="Header--wrapper">
           <img className="logo" src={logoImage} alt="" />
           <span className="title">Meme Generator</span>
         </div>
       </div>
     </>
  )
}
export default Header