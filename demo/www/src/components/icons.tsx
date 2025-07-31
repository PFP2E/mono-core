import {
  Github,
  Twitter,
  Wallet,
  Sun,
  Moon,
  Search,
  type LucideProps
} from 'lucide-react'

export const Icons = {
  GitHub: (props: LucideProps) => <Github {...props} />,
  Twitter: (props: LucideProps) => <Twitter {...props} />,
  Wallet: (props: LucideProps) => <Wallet {...props} />,
  Sun: (props: LucideProps) => <Sun {...props} />,
  Moon: (props: LucideProps) => <Moon {...props} />,
  Search: (props: LucideProps) => <Search {...props} />,
  X: (props: LucideProps) => (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='currentColor'
      viewBox='0 0 16 16'
      {...props}
    >
      <path d='M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.602.75z' />
    </svg>
  )
}
