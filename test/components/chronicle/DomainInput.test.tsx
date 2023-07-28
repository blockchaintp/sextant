/**
 * @jest-environment jsdom
 */

import * as React from "react"
import { render, fireEvent, screen } from "@testing-library/react"
import DomainInput from "../../../src/components/chronicle/DomainInput"
import '@testing-library/jest-dom'

describe("DomainInput", () => {
  let options: string[]
  let onOptionAdd: (newOption: string) => void
  let onOptionRemove: (optionToRemove: string) => void

  beforeEach(() => {
    options = ["http://example.com", "http://google.com"]
    onOptionAdd = jest.fn()
    onOptionRemove = jest.fn()
  })

  test("renders without crashing", () => {
    render(
      <DomainInput
        options={options}
        onOptionAdd={onOptionAdd}
        onOptionRemove={onOptionRemove}
      />
    )
  })

  test("adds an option when a valid URL is entered and the Add button is clicked", () => {
    render(
      <DomainInput
        options={options}
        onOptionAdd={onOptionAdd}
        onOptionRemove={onOptionRemove}
      />
    )

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "http://newurl.com" },
    })
    fireEvent.click(screen.getByRole("button", { name: "Add" }))

    expect(onOptionAdd).toHaveBeenCalledWith("http://newurl.com")
  })

  test("does not add an option when an invalid URL is entered and the Add button is clicked", () => {
    render(
      <DomainInput
        options={options}
        onOptionAdd={onOptionAdd}
        onOptionRemove={onOptionRemove}
      />
    )

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "invalidurl" },
    })
    fireEvent.click(screen.getByRole("button", { name: "Add" }))

    expect(onOptionAdd).not.toHaveBeenCalled()
  })
})
