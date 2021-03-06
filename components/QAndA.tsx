import { ReactNode } from "react";

export default function QAndA({question, children}: { question: string, children: ReactNode }) {
    return (
        <li className="m-2">
          <p className="text-lg italic font-semibold">{question}</p>
          <div className="mx-8 my-2">
            {children}
          </div>
        </li>
    )
}