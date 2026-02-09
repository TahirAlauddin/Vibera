import { cva, type VariantProps } from 'class-variance-authority'

/**
 * Toast variant styles using CVA (Class Variance Authority)
 * This provides type-safe, co-located styling for toast notifications
 * 
 * Note: Some child element styles (like [data-title], [data-icon]) are handled
 * in the Toaster component's toastOptions.classNames for better Sonner integration
 */
export const toastVariants = cva(
  // Base styles for all toasts - minimal to not interfere with Sonner's stacking
  // Removed !important flags where possible to let Sonner handle positioning
  'flex w-full items-center gap-4 rounded-lg border border-[1px] px-4 py-3 text-sm text-black',
  {
    variants: {
      variant: {
        // Success: Light green background, green border, lighter green on hover
        // Using !important only for colors to ensure they persist
        success: 'bg-green-50 border-green-300 hover:bg-green-100 !bg-green-50 !border-green-300',
        // Error: Light red background, red border, lighter red on hover
        error: 'bg-red-50 border-red-300 hover:bg-red-100 !bg-red-50 !border-red-300',
        // Info: Light blue background, blue border, lighter blue on hover
        info: 'bg-blue-50 border-blue-300 hover:bg-blue-100 !bg-blue-50 !border-blue-300',
        // Warning: Light orange/amber background, orange border, lighter orange on hover
        warning: 'bg-orange-50 border-orange-300 hover:bg-orange-100 !bg-orange-50 !border-orange-300',
        // Message: White background, black border, light gray on hover
        message: 'bg-white border-black hover:bg-gray-100 !bg-white !border-black',
      },
    },
    defaultVariants: {
      variant: 'message',
    },
  }
)

export type ToastVariantProps = VariantProps<typeof toastVariants>
