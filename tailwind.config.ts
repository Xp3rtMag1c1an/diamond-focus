
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'sans': ['Inter', 'sans-serif'],
				'jersey': ['"Jersey M54"', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Enhanced baseball theme colors
				baseball: {
					green: '#27ae60',
					darkGreen: '#1e8449',
					lightGreen: '#a8e0bc',
					cream: '#f4f1de',
					darkCream: '#e8e4c9',
					navy: '#1d2d44',
					lightNavy: '#2c3e50',
					wood: '#d4b483',
					darkWood: '#a67c52',
					lightWood: '#e6d2b5',
					leather: '#a5682a',
					red: '#e74c3c',
					brown: '#6d4c41',
					chalk: '#f5f5f5',
					grass: '#2ecc71',
					dirt: '#b7856a',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				'2xl': '1rem',
				'3xl': '1.5rem',
				'4xl': '2rem',
			},
			boxShadow: {
				'neumorph': '10px 10px 20px rgba(0, 0, 0, 0.1), -10px -10px 20px rgba(255, 255, 255, 0.5)',
				'neumorph-dark': '10px 10px 20px rgba(0, 0, 0, 0.3), -10px -10px 20px rgba(255, 255, 255, 0.05)',
				'inner-neumorph': 'inset 5px 5px 10px rgba(0, 0, 0, 0.1), inset -5px -5px 10px rgba(255, 255, 255, 0.5)',
				'inner-neumorph-dark': 'inset 5px 5px 10px rgba(0, 0, 0, 0.3), inset -5px -5px 10px rgba(255, 255, 255, 0.05)',
				'card': '0 10px 30px -5px rgba(0, 0, 0, 0.1), 0 5px 15px -5px rgba(0, 0, 0, 0.05)',
				'card-hover': '0 20px 40px -5px rgba(0, 0, 0, 0.15), 0 10px 20px -5px rgba(0, 0, 0, 0.1)',
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0', opacity: '0' },
					to: { height: 'var(--radix-accordion-content-height)', opacity: '1' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)', opacity: '1' },
					to: { height: '0', opacity: '0' }
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-out': {
					'0%': { opacity: '1', transform: 'translateY(0)' },
					'100%': { opacity: '0', transform: 'translateY(10px)' }
				},
				'scale-in': {
					'0%': { transform: 'scale(0.95)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'rotate-diamond': {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(360deg)' }
				},
				'pulse-soft': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.8' }
				},
				'slide-up': {
					'0%': { transform: 'translateY(10px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				'flip-card': {
					'0%': { transform: 'rotateY(0deg)' },
					'100%': { transform: 'rotateY(180deg)' }
				},
				'base-run': {
					'0%': { transform: 'translateX(0) translateY(0)' },
					'25%': { transform: 'translateX(100%) translateY(0)' },
					'50%': { transform: 'translateX(100%) translateY(100%)' },
					'75%': { transform: 'translateX(0) translateY(100%)' },
					'100%': { transform: 'translateX(0) translateY(0)' }
				},
				'ball-throw': {
					'0%': { transform: 'translateY(0)', opacity: '1' },
					'50%': { transform: 'translateY(-30px)', opacity: '1' },
					'100%': { transform: 'translateY(0)', opacity: '0.2' }
				},
				'bat-swing': {
					'0%': { transform: 'rotate(-45deg)' },
					'50%': { transform: 'rotate(15deg)' },
					'100%': { transform: 'rotate(-45deg)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.4s ease-out',
				'fade-out': 'fade-out 0.4s ease-out',
				'scale-in': 'scale-in 0.3s ease-out',
				'rotate-diamond': 'rotate-diamond 0.5s ease-out',
				'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
				'slide-up': 'slide-up 0.5s ease-out',
				'flip-card': 'flip-card 0.6s ease-in-out',
				'base-run': 'base-run 1.5s ease-in-out',
				'ball-throw': 'ball-throw 0.5s ease-in-out',
				'bat-swing': 'bat-swing 0.7s ease-in-out',
			},
			backgroundImage: {
				'wood-texture': "url('/wood-texture.jpg')",
				'leather-texture': "url('/leather-texture.jpg')", 
				'grass-texture': "url('/grass-texture.jpg')",
				'diamond-pattern': "linear-gradient(45deg, rgba(0,0,0,0.05) 25%, transparent 25%, transparent 50%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.05) 75%, transparent 75%, transparent)",
				'diamond-field': "radial-gradient(ellipse at center, rgba(46, 204, 113, 0.2) 0%, rgba(183, 133, 106, 0.4) 70%)",
				'cream-gradient': "linear-gradient(135deg, #f4f1de 0%, #e8e4c9 100%)",
				'navy-gradient': "linear-gradient(135deg, #1d2d44 0%, #2c3e50 100%)",
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
