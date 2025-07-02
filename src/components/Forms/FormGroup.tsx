import type { ReactNode } from "react"

type FormGroupProps = {
    children: ReactNode
}

export function FormGroup({ children }: FormGroupProps) {
    return (
        <div className="flex flex-col gap-1.5">{children}</div>
    )
}