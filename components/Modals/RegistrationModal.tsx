import styles from "./RegistrationModal.module.css"
import { useContext, useState } from "react";
import { useMutation, useQueryClient } from "react-query"
import { AppContext } from "../../ContextProvider"
import { useForm, SubmitHandler } from "react-hook-form";
import Toasts from "./Toasts";

interface IFormInput {
    name: string,
    price: number,
    stock: number,
    overview: string,
};

interface ICreateProduct {
    name: string,
    price: number,
    stock: number,
    overview: string
}

function RegistrationModal({ font }: { font: string }) {
    const { visibleModal, setVisibleModal } = useContext(AppContext)
    const [visibleToasts, setVisibleToasts] = useState(false)
    const [toastsMessage, setToastsMessage] = useState("")
    const queryClient = useQueryClient()
    const createProduct = useMutation("createProduct", (product: ICreateProduct) =>
        fetch("/api/products", {
            method: "POST",
            body: JSON.stringify(product)
        }).then(() => {
            setVisibleToasts(true)
            setToastsMessage("Produto anunciado!")
            queryClient.refetchQueries("all")
        }).catch((error) => {
            setToastsMessage(error)
        }))

    const { register, handleSubmit, reset, formState: { errors } } = useForm<IFormInput>();
    const onSubmit: SubmitHandler<IFormInput> = (data, event) => {
        event?.preventDefault()
        createProduct.mutate(data)
        reset()

        setTimeout(() => {
            setVisibleToasts(false)
        }, 1000 * 10)
    };

    return (
        <>
            {visibleModal &&
                <div className={font}>
                    {visibleToasts && <Toasts close={setVisibleToasts} message={toastsMessage} />}
                    <div className={styles.modal_background}>
                        <style jsx global>{`
                        body,html{
                            overflow-y:hidden;
                        }
                    `}</style>
                        <form onSubmit={handleSubmit(onSubmit)} className={styles.modal}>
                            <input onClick={() => { setVisibleModal(false) }} className={styles.management_btn} type="button" value="Fechar" />

                            <label htmlFor="name">* Nome do produto (m??x: 100 letras)</label>
                            <input id="name" type="text"  {...register("name", { required: true, maxLength: 100 })} />
                            {errors.name?.type === "required" && <span>O campo
                                &quot;nome do produto&quot; est?? vazio</span>}
                            {errors.name?.type === "maxLength" && <span>M??ximo de 100 letras</span>}

                            <label htmlFor="price">* Pre??o do produto</label>
                            <input id="price" type="number" {...register("price", {
                                required: true,
                            })} />
                            {errors.price?.type === "required" && <span>O campo &quot;pre??o do produto&quot; est?? vazio</span>}

                            <label htmlFor="stock">* Estoque do produto</label>
                            <input id="stock" type="number" {...register("stock", {
                                required: true,
                            })} />
                            {errors.stock?.type === "required" && <span>O campo &quot;estoque do produto&quot; est?? vazio</span>}

                            <label htmlFor="overview">* Descri????o do produto (m??n: 50 letras)</label>
                            <textarea id="overview" {...register("overview", {
                                required: true, minLength: 50
                            })}></textarea>
                            {errors.overview?.type === "required" && <span>O campo &quot;descri????o do produto&quot; est?? vazio</span>}
                            {errors.overview?.type === "minLength" && <span>M??nimo de 50 letras</span>}

                            <input className={styles.management_btn} type="submit" value="Cadastrar" />
                        </form>
                    </div>
                </div>
            }
        </>
    )
}

export default RegistrationModal;