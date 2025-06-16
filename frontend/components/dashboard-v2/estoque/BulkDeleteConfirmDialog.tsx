"use client"

import { AlertTriangle, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface BulkDeleteConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  selectedCount: number
  productNames?: string[]
  isDeleting?: boolean
}

export function BulkDeleteConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  selectedCount,
  productNames = [],
  isDeleting = false,
}: BulkDeleteConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Confirmar Exclusão em Lote
          </DialogTitle>
          <DialogDescription className="text-left space-y-2">
            <p>
              Você está prestes a excluir <strong>{selectedCount}</strong> produto{selectedCount > 1 ? "s" : ""}.
            </p>

            {productNames.length > 0 && (
              <div className="mt-3">
                <p className="font-medium text-gray-700 dark:text-gray-300 mb-2">Produtos selecionados:</p>
                <div className="max-h-32 overflow-y-auto bg-gray-50 dark:bg-gray-800 rounded-md p-2">
                  <ul className="space-y-1">
                    {productNames.slice(0, 10).map((name, index) => (
                      <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
                        • {name}
                      </li>
                    ))}
                    {productNames.length > 10 && (
                      <li className="text-sm text-gray-500 dark:text-gray-500 italic">
                        ... e mais {productNames.length - 10} produto{productNames.length - 10 > 1 ? "s" : ""}
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            )}

            <p className="text-red-600 dark:text-red-400 font-medium mt-3">⚠️ Esta ação não pode ser desfeita!</p>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isDeleting}>
            Cancelar
          </Button>
          <Button className="bg-red-500 hover:bg-red-600 dark:bg-red-800 dark:hover:bg-red-900 dark:text-zinc-100 text-zinc-900" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? (
              <>
                <span className="animate-spin mr-2">◌</span>
                Excluindo...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir {selectedCount} Produto{selectedCount > 1 ? "s" : ""}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
