import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { NameInput } from './NameInput'

function Harness({ onCommit }: { onCommit?: (value: string) => void }) {
  const [value, setValue] = useState('')
  return <NameInput value={value} onChange={setValue} onCommit={onCommit} />
}

describe('NameInput', () => {
  it('подсказывает канонические имена и уменьшительные формы', async () => {
    const user = userEvent.setup()
    render(<Harness />)

    const input = screen.getByRole('combobox')
    await user.click(input)
    expect(screen.getByRole('option', { name: /^Иван/ })).toBeInTheDocument()

    await user.type(input, 'ван')
    expect(screen.getByRole('option', { name: /^Ваня/ })).toBeInTheDocument()
  })

  it('выбирает подсказку по клику и сообщает о завершении ввода', async () => {
    const user = userEvent.setup()
    const onCommit = vi.fn()
    render(<Harness onCommit={onCommit} />)

    const input = screen.getByRole('combobox')
    await user.type(input, 'ван')
    await user.click(screen.getByRole('option', { name: /^Ваня/ }))

    expect(input).toHaveValue('Ваня')
    expect(onCommit).toHaveBeenCalledWith('Ваня')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })
})
