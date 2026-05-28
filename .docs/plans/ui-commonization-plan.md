# UI共通化 実装プラン

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** shadcn/ui コンポーネント（328アプリに重複）を `packages/ui` に集約し、新規アプリは `@tools/ui` からインポートできるようにする

**Architecture:** `packages/ui` を pnpm workspace パッケージとして作成し、shadcn/ui primitives と useToast フックを集約する。Storybook は既存設定のまま `packages/**/src/**/*.stories.*` を読むため追加設定不要。新規アプリ作成スクリプトを更新して per-app コンポーネントコピーを廃止する。

**Tech Stack:** React 18, TypeScript strict, Tailwind CSS 3.4, shadcn/ui (Radix UI), clsx, tailwind-merge, class-variance-authority, lucide-react, Storybook 10, pnpm workspace

---

## ファイルマップ

**新規作成:**
- `packages/ui/package.json` — パッケージメタデータ・依存関係
- `packages/ui/tsconfig.json` — TypeScript設定
- `packages/ui/src/lib/utils.ts` — cn ユーティリティ
- `packages/ui/src/primitives/button.tsx` — Button コンポーネント
- `packages/ui/src/primitives/card.tsx` — Card 系コンポーネント
- `packages/ui/src/primitives/input.tsx` — Input コンポーネント
- `packages/ui/src/primitives/label.tsx` — Label コンポーネント
- `packages/ui/src/primitives/select.tsx` — Select 系コンポーネント
- `packages/ui/src/primitives/toast.tsx` — Toast 系コンポーネント
- `packages/ui/src/primitives/toaster.tsx` — Toaster コンポーネント
- `packages/ui/src/primitives/textarea.tsx` — Textarea コンポーネント
- `packages/ui/src/primitives/switch.tsx` — Switch コンポーネント
- `packages/ui/src/primitives/slider.tsx` — Slider コンポーネント
- `packages/ui/src/primitives/index.ts` — primitives barrel export
- `packages/ui/src/hooks/useToast.ts` — useToast フック
- `packages/ui/src/hooks/index.ts` — hooks barrel export
- `packages/ui/src/components/index.ts` — 複合コンポーネント用プレースホルダー（将来追加）
- `packages/ui/src/index.ts` — メイン barrel export
- `packages/ui/src/primitives/button.stories.tsx` — Button Storybook stories
- `packages/ui/src/primitives/card.stories.tsx` — Card Storybook stories
- `packages/ui/src/primitives/input.stories.tsx` — Input Storybook stories
- `packages/ui/src/primitives/label.stories.tsx` — Label Storybook stories
- `packages/ui/src/primitives/select.stories.tsx` — Select Storybook stories

**変更:**
- `scripts/create-app.js` — 新規アプリで @tools/ui を使うよう template 更新

---

### Task 1: packages/ui のスキャフォールド作成

**Files:**
- Create: `packages/ui/package.json`
- Create: `packages/ui/tsconfig.json`

- [ ] **Step 1: package.json を作成する**

```json
{
  "name": "@tools/ui",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "exports": {
    ".": "./src/index.ts"
  },
  "dependencies": {
    "@radix-ui/react-label": "^2.1.7",
    "@radix-ui/react-select": "^2.2.6",
    "@radix-ui/react-slot": "^1.2.3",
    "@radix-ui/react-switch": "^1.1.4",
    "@radix-ui/react-slider": "^1.2.3",
    "@radix-ui/react-toast": "^1.2.15",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "lucide-react": "^0.546.0",
    "tailwind-merge": "^3.3.1"
  },
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  }
}
```

`packages/ui/package.json` として保存する。

- [ ] **Step 2: tsconfig.json を作成する**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"]
}
```

`packages/ui/tsconfig.json` として保存する。

- [ ] **Step 3: ディレクトリ構造を作成する**

```bash
mkdir -p packages/ui/src/primitives
mkdir -p packages/ui/src/hooks
mkdir -p packages/ui/src/components
mkdir -p packages/ui/src/lib
```

- [ ] **Step 4: pnpm install で workspace に登録する**

```bash
pnpm install
```

Expected: `packages/ui` が workspace パッケージとして認識される（エラーなし）

- [ ] **Step 5: コミット**

```bash
git add packages/ui/package.json packages/ui/tsconfig.json
git commit -m "feat(ui): scaffold @tools/ui package"
```

---

### Task 2: cn ユーティリティを追加

**Files:**
- Create: `packages/ui/src/lib/utils.ts`

- [ ] **Step 1: utils.ts を作成する**

```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

`packages/ui/src/lib/utils.ts` として保存する。

- [ ] **Step 2: コミット**

```bash
git add packages/ui/src/lib/utils.ts
git commit -m "feat(ui): add cn utility to @tools/ui"
```

---

### Task 3: Primitive コンポーネントを追加（button, card, input, label）

**Files:**
- Create: `packages/ui/src/primitives/button.tsx`
- Create: `packages/ui/src/primitives/card.tsx`
- Create: `packages/ui/src/primitives/input.tsx`
- Create: `packages/ui/src/primitives/label.tsx`

注意: import パスを `../../lib/utils` → `../lib/utils` に変更する。

- [ ] **Step 1: button.tsx を作成する**

```typescript
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
```

- [ ] **Step 2: card.tsx を作成する**

```typescript
import * as React from 'react';

import { cn } from '../lib/utils';

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('rounded-lg border bg-card text-card-foreground shadow-sm', className)}
      {...props}
    />
  )
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
  )
);
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('text-2xl font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  )
);
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
  )
);
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
  )
);
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
```

- [ ] **Step 3: input.tsx を作成する**

```typescript
import * as React from 'react';

import { cn } from '../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
```

- [ ] **Step 4: label.tsx を作成する**

```typescript
import * as LabelPrimitive from '@radix-ui/react-label';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '../lib/utils';

const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
);

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root ref={ref} className={cn(labelVariants(), className)} {...props} />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
```

- [ ] **Step 5: コミット**

```bash
git add packages/ui/src/primitives/button.tsx packages/ui/src/primitives/card.tsx \
  packages/ui/src/primitives/input.tsx packages/ui/src/primitives/label.tsx
git commit -m "feat(ui): add button, card, input, label primitives"
```

---

### Task 4: Primitive コンポーネントを追加（select, textarea, switch, slider）

**Files:**
- Create: `packages/ui/src/primitives/select.tsx`
- Create: `packages/ui/src/primitives/textarea.tsx`
- Create: `packages/ui/src/primitives/switch.tsx`
- Create: `packages/ui/src/primitives/slider.tsx`

- [ ] **Step 1: select.tsx を作成する**

```typescript
import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import * as React from 'react';

import { cn } from '../lib/utils';

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn('flex cursor-default items-center justify-center py-1', className)}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn('flex cursor-default items-center justify-center py-1', className)}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        'relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        position === 'popper' &&
          'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          'p-1',
          position === 'popper' &&
            'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]'
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn('py-1.5 pl-8 pr-2 text-sm font-semibold', className)}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-muted', className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
```

- [ ] **Step 2: textarea.tsx を作成する**

```typescript
import * as React from 'react';

import { cn } from '../lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
```

- [ ] **Step 3: switch.tsx を作成する**

```typescript
import * as SwitchPrimitives from '@radix-ui/react-switch';
import * as React from 'react';

import { cn } from '../lib/utils';

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input',
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        'pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0'
      )}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
```

- [ ] **Step 4: slider.tsx を作成する**

```typescript
import * as SliderPrimitive from '@radix-ui/react-slider';
import * as React from 'react';

import { cn } from '../lib/utils';

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn('relative flex w-full touch-none select-none items-center', className)}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
      <SliderPrimitive.Range className="absolute h-full bg-primary" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
```

- [ ] **Step 5: コミット**

```bash
git add packages/ui/src/primitives/select.tsx packages/ui/src/primitives/textarea.tsx \
  packages/ui/src/primitives/switch.tsx packages/ui/src/primitives/slider.tsx
git commit -m "feat(ui): add select, textarea, switch, slider primitives"
```

---

### Task 5: Toast / Toaster / useToast を追加

**Files:**
- Create: `packages/ui/src/primitives/toast.tsx`
- Create: `packages/ui/src/primitives/toaster.tsx`
- Create: `packages/ui/src/hooks/useToast.ts`

注意: `toaster.tsx` は `useToast` を `../hooks/useToast` から、toast コンポーネントを `./toast` から import する。

- [ ] **Step 1: toast.tsx を作成する**

```typescript
import * as ToastPrimitives from '@radix-ui/react-toast';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import * as React from 'react';

import { cn } from '../lib/utils';

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      'fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]',
      className
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full',
  {
    variants: {
      variant: {
        default: 'border bg-background text-foreground',
        destructive:
          'destructive group border-destructive bg-destructive text-destructive-foreground',
        success: 'border-green-500 bg-green-50 text-green-900',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> & VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  );
});
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      'inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive',
      className
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      'absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600',
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title ref={ref} className={cn('text-sm font-semibold', className)} {...props} />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn('text-sm opacity-90', className)}
    {...props}
  />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;
type ToastActionElement = React.ReactElement<typeof ToastAction>;

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
};
```

- [ ] **Step 2: useToast.ts を作成する**

```typescript
import type { ToastActionElement, ToastProps } from '../primitives/toast';
import * as React from 'react';

const TOAST_LIMIT = 3;
const TOAST_REMOVE_DELAY = 5000;

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

const _actionTypes = {
  ADD_TOAST: 'ADD_TOAST',
  UPDATE_TOAST: 'UPDATE_TOAST',
  DISMISS_TOAST: 'DISMISS_TOAST',
  REMOVE_TOAST: 'REMOVE_TOAST',
} as const;

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

type ActionType = typeof _actionTypes;

type Action =
  | { type: ActionType['ADD_TOAST']; toast: ToasterToast }
  | { type: ActionType['UPDATE_TOAST']; toast: Partial<ToasterToast> }
  | { type: ActionType['DISMISS_TOAST']; toastId?: ToasterToast['id'] }
  | { type: ActionType['REMOVE_TOAST']; toastId?: ToasterToast['id'] };

interface State {
  toasts: ToasterToast[];
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({ type: 'REMOVE_TOAST', toastId });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };
    case 'UPDATE_TOAST':
      return {
        ...state,
        toasts: state.toasts.map((t) => (t.id === action.toast.id ? { ...t, ...action.toast } : t)),
      };
    case 'DISMISS_TOAST': {
      const { toastId } = action;
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast) => addToRemoveQueue(toast.id));
      }
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined ? { ...t, open: false } : t
        ),
      };
    }
    case 'REMOVE_TOAST':
      if (action.toastId === undefined) {
        return { ...state, toasts: [] };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
};

const listeners: Array<(state: State) => void> = [];
let memoryState: State = { toasts: [] };

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => listener(memoryState));
}

type Toast = Omit<ToasterToast, 'id'>;

function toast({ ...props }: Toast) {
  const id = genId();

  const update = (props: ToasterToast) =>
    dispatch({ type: 'UPDATE_TOAST', toast: { ...props, id } });
  const dismiss = () => dispatch({ type: 'DISMISS_TOAST', toastId: id });

  dispatch({
    type: 'ADD_TOAST',
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  return { id, dismiss, update };
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: 'DISMISS_TOAST', toastId }),
  };
}

export { useToast, toast };
```

- [ ] **Step 3: toaster.tsx を作成する**

```typescript
import { useToast } from '../hooks/useToast';
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from './toast';

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, ...props }) => (
        <Toast key={id} {...props}>
          <div className="grid gap-1">
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && <ToastDescription>{description}</ToastDescription>}
          </div>
          {action}
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  );
}
```

- [ ] **Step 4: コミット**

```bash
git add packages/ui/src/primitives/toast.tsx packages/ui/src/primitives/toaster.tsx \
  packages/ui/src/hooks/useToast.ts
git commit -m "feat(ui): add toast, toaster, useToast to @tools/ui"
```

---

### Task 6: Barrel exports を作成

**Files:**
- Create: `packages/ui/src/primitives/index.ts`
- Create: `packages/ui/src/hooks/index.ts`
- Create: `packages/ui/src/components/index.ts`
- Create: `packages/ui/src/index.ts`

- [ ] **Step 1: primitives/index.ts を作成する**

```typescript
export * from './button';
export * from './card';
export * from './input';
export * from './label';
export * from './select';
export * from './toast';
export { Toaster } from './toaster';
export * from './textarea';
export * from './switch';
export * from './slider';
```

- [ ] **Step 2: hooks/index.ts を作成する**

```typescript
export { useToast, toast } from './useToast';
```

- [ ] **Step 3: components/index.ts を作成する**

```typescript
// 複合コンポーネントはここに追加する
```

- [ ] **Step 4: src/index.ts を作成する**

```typescript
export * from './primitives';
export * from './hooks';
export * from './components';
```

- [ ] **Step 5: TypeScript コンパイルを確認する**

```bash
cd packages/ui && npx tsc --noEmit
```

Expected: エラーなし

- [ ] **Step 6: コミット**

```bash
git add packages/ui/src/primitives/index.ts packages/ui/src/hooks/index.ts \
  packages/ui/src/components/index.ts packages/ui/src/index.ts
git commit -m "feat(ui): add barrel exports for @tools/ui"
```

---

### Task 7: Storybook stories を packages/ui に追加

**Files:**
- Create: `packages/ui/src/primitives/button.stories.tsx`
- Create: `packages/ui/src/primitives/card.stories.tsx`
- Create: `packages/ui/src/primitives/input.stories.tsx`
- Create: `packages/ui/src/primitives/label.stories.tsx`
- Create: `packages/ui/src/primitives/select.stories.tsx`

注意: `title` は `@tools/ui/Button` のようなプレフィックスを使い、per-app stories（`UI/Button`）と競合しない。

- [ ] **Step 1: button.stories.tsx を作成する**

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';

const meta = {
  title: '@tools/ui/Button',
  component: Button,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: 'Button', variant: 'default' } };
export const Destructive: Story = { args: { children: 'Delete', variant: 'destructive' } };
export const Outline: Story = { args: { children: 'Outline', variant: 'outline' } };
export const Secondary: Story = { args: { children: 'Secondary', variant: 'secondary' } };
export const Ghost: Story = { args: { children: 'Ghost', variant: 'ghost' } };
export const Link: Story = { args: { children: 'Link', variant: 'link' } };
export const Small: Story = { args: { children: 'Small', size: 'sm' } };
export const Large: Story = { args: { children: 'Large', size: 'lg' } };

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Button variant="default">Default</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>
      <div className="flex items-center gap-2">
        <Button size="sm">Small</Button>
        <Button size="default">Default</Button>
        <Button size="lg">Large</Button>
      </div>
    </div>
  ),
};
```

- [ ] **Step 2: card.stories.tsx を作成する**

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card';

const meta = {
  title: '@tools/ui/Card',
  component: Card,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content goes here.</p>
      </CardContent>
    </Card>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Create Project</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Configure your project settings below.</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Deploy</Button>
      </CardFooter>
    </Card>
  ),
};
```

- [ ] **Step 3: input.stories.tsx を作成する**

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './input';
import { Label } from './label';

const meta = {
  title: '@tools/ui/Input',
  component: Input,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { placeholder: 'Enter text...' } };
export const Disabled: Story = { args: { placeholder: 'Disabled input', disabled: true } };

export const WithLabel: Story = {
  render: () => (
    <div className="w-[350px] space-y-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="email@example.com" />
    </div>
  ),
};
```

- [ ] **Step 4: label.stories.tsx を作成する**

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './input';
import { Label } from './label';

const meta = {
  title: '@tools/ui/Label',
  component: Label,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: 'Label' } };

export const WithInput: Story = {
  render: () => (
    <div className="w-[350px] space-y-2">
      <Label htmlFor="username">Username</Label>
      <Input id="username" placeholder="Enter your username" />
    </div>
  ),
};
```

- [ ] **Step 5: select.stories.tsx を作成する**

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';

const meta = {
  title: '@tools/ui/Select',
  component: Select,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option1">Option 1</SelectItem>
        <SelectItem value="option2">Option 2</SelectItem>
        <SelectItem value="option3">Option 3</SelectItem>
      </SelectContent>
    </Select>
  ),
};
```

- [ ] **Step 6: Storybook を起動して @tools/ui カテゴリが表示されることを確認する**

```bash
pnpm storybook
```

Expected: http://localhost:6006 で `@tools/ui` グループ配下に Button, Card, Input, Label, Select が表示される

- [ ] **Step 7: コミット**

```bash
git add packages/ui/src/primitives/*.stories.tsx
git commit -m "feat(ui): add Storybook stories for @tools/ui primitives"
```

---

### Task 8: React SPA テンプレートを追加して create-app.js を更新する

**背景:** `templates/app/` は Cloudflare Workers + Hono テンプレート（router用）。React SPA ツールは現在 `url-encoder` をコピーして作成する慣習。
新たに `templates/react-spa/` を作成し、新規 React SPA ツールが `@tools/ui` を使うようにする。

**Files:**
- Create: `templates/react-spa/package.json`
- Create: `templates/react-spa/tsconfig.json`
- Create: `templates/react-spa/tailwind.config.js`
- Create: `templates/react-spa/postcss.config.js`
- Create: `templates/react-spa/vite.config.ts`
- Create: `templates/react-spa/index.html`
- Create: `templates/react-spa/src/main.tsx`
- Create: `templates/react-spa/src/App.tsx`
- Create: `templates/react-spa/src/index.css`
- Modify: `scripts/create-app.js`

- [ ] **Step 1: templates/react-spa/package.json を作成する**

```json
{
  "name": "{{APP_NAME}}",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vp dev",
    "build": "vp build",
    "test": "vp test",
    "check": "vp check"
  },
  "dependencies": {
    "@tools/ui": "workspace:*",
    "lucide-react": "^0.546.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.3.0",
    "@testing-library/user-event": "^14.6.1",
    "@types/react": "^18.3.23",
    "@types/react-dom": "^18.3.7",
    "@vitejs/plugin-react-swc": "^3.9.0",
    "autoprefixer": "^10.4.21",
    "postcss": "^8.5.3",
    "tailwindcss": "^3.4.0",
    "tailwindcss-animate": "^1.0.7",
    "typescript": "^5.8.3",
    "vite-plus": "^0.3.0"
  }
}
```

- [ ] **Step 2: templates/react-spa/tsconfig.json を作成する**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "allowJs": true,
    "paths": {
      "*": ["./*"],
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@utils/*": ["./src/utils/*"],
      "@types": ["./src/types"],
      "@config/*": ["./src/config/*"],
      "@hooks/*": ["./src/hooks/*"],
      "@services/*": ["./src/services/*"]
    }
  },
  "include": ["src"]
}
```

- [ ] **Step 3: templates/react-spa/vite.config.ts を作成する**

```typescript
import path from 'node:path';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite-plus';

export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    port: 5200,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@types': path.resolve(__dirname, './src/types'),
      '@config': path.resolve(__dirname, './src/config'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@services': path.resolve(__dirname, './src/services'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
  },
});
```

- [ ] **Step 4: templates/react-spa/tailwind.config.js を作成する**

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
        popover: { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
```

- [ ] **Step 5: templates/react-spa/postcss.config.js を作成する**

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 6: templates/react-spa/index.html を作成する**

```html
<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{{APP_TITLE}} - Elchika Tools</title>
    <meta name="description" content="{{APP_DESCRIPTION}}" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 7: templates/react-spa/src/main.tsx を作成する**

```typescript
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

ReactDOM.createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

- [ ] **Step 8: templates/react-spa/src/App.tsx を作成する**

```typescript
import { Button, Card, CardContent, CardHeader, CardTitle, Toaster } from '@tools/ui';
import { useToast } from '@tools/ui';

export default function App() {
  const { toast } = useToast();

  return (
    <div className="min-h-screen bg-background p-8">
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>{{APP_TITLE}}</CardTitle>
        </CardHeader>
        <CardContent>
          <Button type="button" onClick={() => toast({ title: 'Hello!' })}>
            Click me
          </Button>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
}
```

- [ ] **Step 9: templates/react-spa/src/index.css を作成する**

`apps/url-encoder/src/index.css` をそのままコピーする。

```bash
cp apps/url-encoder/src/index.css templates/react-spa/src/index.css
```

- [ ] **Step 10: create-app.js に React SPA テンプレートオプションを追加する**

`scripts/create-app.js` の `templateDir` を決定している箇所（L375付近）を以下のように更新する：

```javascript
// 変更前
const templateDir = path.join(__dirname, '..', 'templates', 'app');

// 変更後
const useReactTemplate = args.includes('--react') || args.includes('-r');
const templateName = useReactTemplate ? 'react-spa' : 'app';
const templateDir = path.join(__dirname, '..', 'templates', templateName);
```

ヘルプメッセージにも `--react, -r  React SPA テンプレートを使用` を追記する。

- [ ] **Step 11: 動作確認する**

```bash
node scripts/create-app.js --react test-ui-spa "UIテスト用SPAアプリ"
cd apps/test-ui-spa && pnpm install && vp dev
```

Expected:
- `apps/test-ui-spa/package.json` に `"@tools/ui": "workspace:*"` がある
- `apps/test-ui-spa/src/components/ui/` ディレクトリが存在しない
- `vp dev` でアプリが起動し、ブラウザでボタンが表示される

- [ ] **Step 12: テスト用アプリを削除する**

```bash
node scripts/delete-app.js test-ui-spa
```

- [ ] **Step 13: コミット**

```bash
git add templates/react-spa/ scripts/create-app.js
git commit -m "feat(ui): add React SPA template using @tools/ui"
```

---

## 完了チェックリスト

- [ ] `pnpm install` がエラーなく完了する
- [ ] `cd packages/ui && npx tsc --noEmit` がエラーなし
- [ ] `pnpm storybook` で `@tools/ui` グループが表示される
- [ ] `node scripts/create-app.js` で生成した新規アプリが `@tools/ui` を使う
- [ ] 既存アプリ（`apps/url-encoder` など）のビルドが壊れていない: `cd apps/url-encoder && vp build`
