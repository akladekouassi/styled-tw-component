# Styled-TW-Component

**`Styled-TW-Component`** is a utility library for creating stylish React components using Tailwind CSS. It provides a simple and flexible API to apply dynamic classes, manage variants, and customize your components with specific styles.

---

## 🚀 Features

- Create stylish components for all common HTML tags.
- Supports dynamic classes via a function `styleWithProps`.
- Handles style variants with the `variants`.
- Includes a generic method `create` for more complex or customized components.
- Compatible with TypeScript for an optimized development experience.

---

## 📦 Installation

```bash
# Use with Yarn
yarn add styled-tw-component

# Use with npm
npm install styled-tw-component
```

## ✨ Quick Use

```
import Styled from "styled-tw-component";

const Button = Styled.button(`px-4 py-2`);

// Use
export default function App() {
  return (
    <div>
      <Button>Bouton Principal</Button>
    </div>
  );
}

```

## use variations

```
const Text = Styled.span("text-base", {
  variants: {
    primary: "text-blue-500",
    secondary: "text-gray-500",
  },
});

// Use
<Text variant="primary">Texte Principal</Text>
<Text variant="secondary">Texte Secondaire</Text>
```

## Use the create method for a custom component

```
const Section = Styled.create<{ isActive: boolean }, "section">("p-4", {
  as: "section",
  styleWithProps: ({ isActive }) => (isActive ? "bg-green-500" : "bg-red-500"),
});

// Use
<Section isActive={true}>Section Active</Section>
<Section isActive={false}>Section Inactive</Section>
```

## Use the create method to style another component.

```
Example 1:

const Button = ({ className }: { className?: string }) => {
  return <button className={className}>Button Label</button>;
};

const ButtonWrapper = Styled.create<{ className: string }, typeof Button>(
  `inline-flex items-center`,
  {
    as: Button,
    styleWithProps:(props)=> return props.className,
  }
);

// Use
<ButtonWrapper className="dark:bg-gray-800 dark:text-gray-400" />

-----------------------

Example 2:
const CustomComponent: React.FC<{ className: string; isActive: boolean }> = ({
  className,
  isActive,
}) => {
  return isActive ? (
    <p className={className}>This is active content</p>
  ) : (
    <p className={className}>This is Inactive content</p>
  );
};

const CustomComponentWrap = Styled.create<
  React.ComponentProps<typeof CustomComponent>,
  typeof CustomComponent
>('p-4', {
  as: CustomComponent,
  styleWithProps: ({ className }) => className,
});


// Use
<CustomComponentWrap isActive={false} className="bg-red-600" />

```

## Use common HTML tags

**`Styled`** exposes a method for each current HTML tag such as **`div`**, **`span`**, **`button`**, etc.

```
const Wrapper = Styled.div("p-4 bg-gray-100");

const Title = Styled.h1("text-2xl font-bold text-center");

// Use
<Wrapper>
  <Title>Welcome on Styled-TW-Component</Title>
</Wrapper>
```

## 🛠️ API

Method **`create`**
The **`create`** method allows you to create components with custom tags, custom component or advanced requirements

```
Styled.create<Props, As extends React.ElementType>(
  baseClass: string | ((props: Props) => string),
  config?: {
    as?: As;
    variants?: Record<string, string>;
    styleWithProps?: (props: Props) => string;
  }
): React.FC<React.ComponentPropsWithoutRef<As> & Props>;

```

- **`baseClass`** (string | function) : The base class or function that dynamically generates the class.
- **`config`** (object) :
  - **`as`** (React.ElementType) : Defines the HTML tag or component used.
  - **`variants`** (Record<string, string>) : Define variants for different configurations.
  - **`styleWithProps`** (function) : Generates dynamic classes based on props.

## 📝 The Future ?

For now compatible with React, make compatible angular, VueJS, add cool features etc.

## 📝 Contributions

Contributions are welcome! Please open an issue or submit a pull request.

## 💡 Auteur

Developed with ❤️ by [AKS](https://github.com/akladekouassi)
