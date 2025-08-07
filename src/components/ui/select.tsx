<<<<<<< HEAD
'use client';

import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
=======

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react"

import { cn } from "@/lib/utils"
>>>>>>> 625e753ab51fcc8dcd66e856f1778ad1697fb266

function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
<<<<<<< HEAD
  return <SelectPrimitive.Root data-slot="select" {...props} />;
=======
  return <SelectPrimitive.Root data-slot="select" {...props} />
>>>>>>> 625e753ab51fcc8dcd66e856f1778ad1697fb266
}

function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
<<<<<<< HEAD
  return <SelectPrimitive.Group data-slot="select-group" {...props} />;
=======
  return <SelectPrimitive.Group data-slot="select-group" {...props} />
>>>>>>> 625e753ab51fcc8dcd66e856f1778ad1697fb266
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
<<<<<<< HEAD
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
=======
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
>>>>>>> 625e753ab51fcc8dcd66e856f1778ad1697fb266
}

function SelectTrigger({
  className,
<<<<<<< HEAD
  size = 'default',
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: 'sm' | 'default';
=======
  size = "default",
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default"
>>>>>>> 625e753ab51fcc8dcd66e856f1778ad1697fb266
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
<<<<<<< HEAD
        className,
=======
        className
>>>>>>> 625e753ab51fcc8dcd66e856f1778ad1697fb266
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="size-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
<<<<<<< HEAD
  );
=======
  )
>>>>>>> 625e753ab51fcc8dcd66e856f1778ad1697fb266
}

function SelectContent({
  className,
  children,
<<<<<<< HEAD
  position = 'popper',
=======
  position = "popper",
>>>>>>> 625e753ab51fcc8dcd66e856f1778ad1697fb266
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
<<<<<<< HEAD
          'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md',
          position === 'popper' &&
            'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
          className,
=======
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className
>>>>>>> 625e753ab51fcc8dcd66e856f1778ad1697fb266
        )}
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
<<<<<<< HEAD
            'p-1',
            position === 'popper' &&
              'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1',
=======
            "p-1",
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"
>>>>>>> 625e753ab51fcc8dcd66e856f1778ad1697fb266
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
<<<<<<< HEAD
  );
=======
  )
>>>>>>> 625e753ab51fcc8dcd66e856f1778ad1697fb266
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
<<<<<<< HEAD
      className={cn('text-muted-foreground px-2 py-1.5 text-xs', className)}
      {...props}
    />
  );
=======
      className={cn("text-muted-foreground px-2 py-1.5 text-xs", className)}
      {...props}
    />
  )
>>>>>>> 625e753ab51fcc8dcd66e856f1778ad1697fb266
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
<<<<<<< HEAD
        className,
=======
        className
>>>>>>> 625e753ab51fcc8dcd66e856f1778ad1697fb266
      )}
      {...props}
    >
      <span className="absolute right-2 flex size-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
<<<<<<< HEAD
  );
=======
  )
>>>>>>> 625e753ab51fcc8dcd66e856f1778ad1697fb266
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
<<<<<<< HEAD
      className={cn('bg-border pointer-events-none -mx-1 my-1 h-px', className)}
      {...props}
    />
  );
=======
      className={cn("bg-border pointer-events-none -mx-1 my-1 h-px", className)}
      {...props}
    />
  )
>>>>>>> 625e753ab51fcc8dcd66e856f1778ad1697fb266
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
<<<<<<< HEAD
        'flex cursor-default items-center justify-center py-1',
        className,
=======
        "flex cursor-default items-center justify-center py-1",
        className
>>>>>>> 625e753ab51fcc8dcd66e856f1778ad1697fb266
      )}
      {...props}
    >
      <ChevronUpIcon className="size-4" />
    </SelectPrimitive.ScrollUpButton>
<<<<<<< HEAD
  );
=======
  )
>>>>>>> 625e753ab51fcc8dcd66e856f1778ad1697fb266
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
<<<<<<< HEAD
        'flex cursor-default items-center justify-center py-1',
        className,
=======
        "flex cursor-default items-center justify-center py-1",
        className
>>>>>>> 625e753ab51fcc8dcd66e856f1778ad1697fb266
      )}
      {...props}
    >
      <ChevronDownIcon className="size-4" />
    </SelectPrimitive.ScrollDownButton>
<<<<<<< HEAD
  );
=======
  )
>>>>>>> 625e753ab51fcc8dcd66e856f1778ad1697fb266
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
<<<<<<< HEAD
};
=======
}
>>>>>>> 625e753ab51fcc8dcd66e856f1778ad1697fb266
