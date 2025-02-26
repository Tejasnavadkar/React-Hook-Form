import { useForm, SubmitHandler } from "react-hook-form"
import './App.css'

interface formDataType{
  name:string,
  lastname:string
}

function App() {
    // this form not reload page on submit
    //isSubmitting refers that is this form in process or not
  const { register, handleSubmit, watch ,formState: { errors,isSubmitting } } = useForm<formDataType>()

   const formSubmit:SubmitHandler<formDataType> = async (data:formDataType) =>{
    // now i want once form submit you cant resubmit emmediately while api call in proccess

      await new Promise((resolve)=>setTimeout(resolve,5000))

    console.log('data-',data)
   }


  return (
    <>
      <form onSubmit={handleSubmit(formSubmit)} style={{display:"flex" ,flexDirection:"column", }}> 
        <input 
        {...register("name",{
         minLength:{
          value:3,
          message:'name must be atleast 3 character '}  // here its not required so we can submit with empty value but if we enter something then it validates 
        })} 
        type="text" 
        placeholder="name" 
        style={{padding:"4px",outline:'none', border:`${errors.name ? 'red 2px solid' : ''}`}} 
        />
        {errors.name && (<span style={{color:'red',fontSize:'1rem'}} >{errors.name.message}</span>)}

        <input 
        {...register("lastname",{
          pattern:{
            value:/^[A-Za-z]+$/i ,   // only characters
            message:'lastname is not asper regex-pattern'
          }
        })} 
        type="text" 
        placeholder="lastname" 
        style={{padding:"4px", color:""}} 
        />
        {errors.lastname && (<p style={{color:'red',fontSize:'1rem'}}>{errors.lastname.message}</p>)}

        <button 
        disabled={isSubmitting}  // agar form submiting phase me hai to disabled for prevent multiple submissions
        >{isSubmitting ? 'submiting':'submit'}</button>
      </form>

    </>
  )
}

export default App

// register to link input filed to form state so form can track the filed (codehelp-yt)


