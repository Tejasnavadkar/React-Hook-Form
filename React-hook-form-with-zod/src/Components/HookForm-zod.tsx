import { Controller, SubmitHandler, useFieldArray, useForm } from 'react-hook-form'
import DatePicker from 'react-datepicker'
import simulatedApi from '../api/api'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

// in this component we add Zod validation instead of apply default validations
// we need zod resolvers for that



const HookFormWithZod = () => {

    const formSchema = z.object({
        firstName:z.string().min(3,"firstName must be atleast 3 characters"),
        lastName:z.string().min(3,"lastName must at least 3 characters"),
        email:z.string().email("Invalid Email"),
        age:z.number().min(18,"age must be atleast 18"),
        gender:z.enum(['male','female','other'],{message:"gender is required"}),
        address:z.object({
            city:z.string().min(1,"city is required"),
            state:z.string().min(1,"state is required")
        }),
        hobbies:z.array(
            z.object({
                name:z.string().min(1,"hobby is required")
            })
        ).min(1,"At least one hobby is required"),
        startDate:z.date(),
        subscribe:z.boolean(),
        referral:z.string().default("") // default value emty string

    })

// Define FormData type based on schema
type FormData = z.infer<typeof formSchema>;

    const { 
        register, // to track fields
        handleSubmit,
        formState: { errors, isSubmitting },
        control, // when we use external library or deal with array fields controller
        getValues, // toget get any field value of form
        setError,
        watch // to monitor field and onchange returned that changed value

        } = useForm<FormData>({  // ctrl + space to findout values that returns hook
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            age: 18,
            gender: undefined,
            address: { city: "", state: "" },
            hobbies: [{ name: "" }],
            startDate: new Date(),
            subscribe: false,
            referral: "",
        },
        resolver:zodResolver(formSchema)
    })

    const { fields, append, remove } = useFieldArray({
        control,   // give it a control of useForm , // control props comes from useForm (optional: if you are using FormContext)
        name: "hobbies"  // array name ,// unique name for your Field Array
    })

   const isFiledVisible = watch('subscribe')

    const onSubmit:SubmitHandler<FormData> = async (data) =>{
    try {
        const response =  await simulatedApi(data)
        console.log('response-',response)
    } catch (error: any) {
        console.error('error',error)

        setError("root",{  // root generally used for server side error
            message:error.message
        })
    }
    }

    return (
        <form
             onSubmit={handleSubmit(onSubmit)}
            style={{ display: "flex", flexDirection: "column", gap: 5 }}
        >
            <div>
                <label>First Name</label>
                <input
                    {...register("firstName")}
                />
                {errors.firstName && (
                    <p style={{ color: "orangered" }}>{errors.firstName.message}</p>
                )}
            </div>

            <div>
                <label>Last Name</label>
                <input
                    {...register("lastName")}
                />
                {errors.lastName && (
                    <p style={{ color: "orangered" }}>{errors.lastName.message}</p>
                )}
            </div>

            <div>
                <label>Email</label>
                <input
                    {...register("email")}
                />
                {errors.email && <p style={{ color: "orangered" }}>{errors.email.message}</p>}
            </div>

            <div>
                <label>Age</label>
                <input
                    {...register("age")}
                />
                {errors.age && <p style={{ color: "orangered" }}>{errors.age.message}</p>}
            </div>

            <div>
                <label>Gender</label>
                <select
                    {...register("gender")}
                >
                    <option value="">Select...</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select>
                {errors.gender && <p style={{ color: "orangered" }}>{errors.gender.message}</p>}
            </div>

            <div>
                <label>Address</label>               {/* in address i want when i city enter then only state is requird */}
                <input
                    {...register("address.city")}
                    placeholder="City"
                />
                {errors.address?.city && (
                    <p style={{ color: "orangered" }}>{errors.address.city.message}</p>
                )}

                <input
                    {...register("address.state")}
                    placeholder="State"
                />
                {errors.address?.state && (
                    <p style={{ color: "orangered" }}>{errors.address.state.message}</p>
                )}
            </div>

            <div>
                <label>Start Date</label>  {/* here in this DatePicker case it works differntly coz this is external library so for that we us controller or useController hook */}
                <Controller
                    control={control}
                    name="startDate"
                    // rules={{ required: "Start Date is required" }} // validation required filed
                    render={({ field }) => {
                        return <DatePicker
                            selected={field.value}
                            onChange={(date: Date | null) => field.onChange(date)}
                            placeholderText='Select Date'
                        />
                    }}
                />
                {errors.startDate && ( <p style={{ color: "orangered" }}>{errors.startDate.message}</p>)}

                {/* <DatePicker            
             selected={formData.startDate}
             onChange={(date: Date | null) =>
               setFormData({ ...formData, startDate: date || new Date() })
             }
           /> */}
            </div>

            <div>
                <label>Hobbies</label>          {/* to handle array there is a hook useFieldArray() */}
                {fields.map((hobby, index) => (
                    <div key={hobby.id}>
                        <input
                            {...register(`hobbies.${index}.name` )} // 1st index wala element ka name
                            placeholder="Hobby Name"
                        />
                        {errors.hobbies?.[index]?.name && (
                            <p style={{ color: "orangered" }}>{errors.hobbies[index].name.message}</p>
                        )}

                        {fields.length > 1 && (
                            <button type="button" onClick={() => remove(index)}>
                                Remove Hobby
                            </button>
                        )}
                    </div>
                ))}   
                <button type="button" onClick={() => append({name:""})}> {/* when click on this it add empty item insert(fields.length, { name: "" }) */}
                    Add Hobby
                </button>
            </div>

            <div>
                <label htmlFor="sub">Subscribe to Newsletter</label>
                <input
                    type='checkbox'
                    {...register("subscribe")}
                />
            </div>
            {isFiledVisible && (
                <div>
                    <label>Referral Source</label>
                    <input
                       {...register("referral")}
                        placeholder="How did you hear about us?"
                    />
                    {errors.referral && (
                        <p style={{ color: "orangered" }}>{errors.referral.message}</p>
                    )}
                </div>
            )}

            {errors.root && <p style={{ color: "red" }}>{errors.root.message}</p>}  {/* root errors for server side errorswhenever our api fails */}

            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit"}
            </button>
        </form>
    )
}

export default HookFormWithZod

// The watch function in React Hook Form is used to watch the value of a specific field or fields. It does not inherently return a boolean; it returns the current value of the field being watched.

// In your case, watch('subscribe') will return the current value of the subscribe field, which could be a boolean if the subscribe field is a checkbox or a boolean input.

// Here's an example to illustrate:
// (roadsidecoder)




