/** A single button API for links and actions, with consistent visual variants. */
export default function Button({
  as: Element = 'a', variant = 'primary', size = 'md',
  block = false, inverse = false, className = '', children, ...props
}) {
  const classes = [
    'ui-button', `ui-button--${variant}`, `ui-button--${size}`,
    block && 'ui-button--block', inverse && 'ui-button--inverse', className,
  ].filter(Boolean).join(' ')
  return <Element className={classes} {...props}>{children}</Element>
}
