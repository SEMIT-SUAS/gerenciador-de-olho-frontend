"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { X, Loader2 } from "lucide-react"

import { secretariaSchema } from "../../schemas/secretariaSchema"
import { uploadSecretaria } from "../../services/secretariaService"
import type { createSecretaria } from "../../types/Secretaria"

interface SecretariaFormModalProps {
  onClose: () => void
  onSuccess: () => void
}

export function SecretariaFormModal({ onClose, onSuccess }: SecretariaFormModalProps) {
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
  } = useForm<createSecretaria>({
    defaultValues: {
      nome: "",
      sigla: "",
      visivel: true,
      ativo: true,
    },
  })

  const onSubmit = async (data: createSecretaria) => {
    setLoading(true)
    try {
      secretariaSchema.parse(data)
      await uploadSecretaria(data)
      toast.success("Secretaria cadastrada com sucesso!")
      reset()
      onSuccess()
    } catch (error: any) {
      if (error?.name === "ZodError") {
        for (const err of error.errors) {
          setError(err.path[0] as keyof createSecretaria, { message: err.message })
        }
        toast.error(error.errors.map((e: any) => e.message).join("\n"))
      } else {
        toast.error(error?.message || "Erro ao cadastrar.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg outline-none">
        <div className="mb-4 flex items-start justify-between">
          <h2 className="text-xl font-semibold">Cadastrar Secretaria</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar modal"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100  focus:outline-none focus:ring-2 focus:ring-neutral-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-2">
            <label htmlFor="nome" className="text-sm font-medium text-neutral-700">
              Nome
            </label>
            <input
              id="nome"
              type="text"
              placeholder="Nome"
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-200"
              {...register("nome")}
            />
            {errors.nome && <p className="text-sm text-red-600">{errors.nome.message}</p>}
          </div>

          <div className="grid gap-2">
            <label htmlFor="sigla" className="text-sm font-medium text-neutral-700">
              Sigla
            </label>
            <input
              id="sigla"
              type="text"
              placeholder="Sigla"
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-200"
              {...register("sigla")}
            />
            {errors.sigla && <p className="text-sm text-red-600">{errors.sigla.message}</p>}
          </div>

          <div className="grid gap-3">
            <label htmlFor="visivel" className="flex cursor-pointer items-center gap-2">
              <input id="visivel" type="checkbox" className="h-4 w-4 accent-neutral-900" {...register("visivel")} />
              <span className="text-sm text-neutral-600">Visível</span>
            </label>

            <label htmlFor="ativo" className="flex cursor-pointer items-center gap-2">
              <input id="ativo" type="checkbox" className="h-4 w-4 accent-neutral-900" {...register("ativo")} />
              <span className="text-sm text-neutral-600">Ativo</span>
            </label>
          </div>

          <div className="mt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-200 disabled:opacity-50"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Salvando...
                </span>
              ) : (
                "Cadastrar"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Component() {
  return <SecretariaFormModal onClose={() => console.log("close")} onSuccess={() => console.log("success")} />
}
