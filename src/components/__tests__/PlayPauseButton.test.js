import React from "react";
import PlayPauseButton from "../PlayPauseButton";
import { shallow, render, mount } from "enzyme";

describe("Conditional rendering and onClick event", () => {
  test("renders play icon when props.paused = true", () => {
    const wrapper = render(<PlayPauseButton paused={true} />);
    expect(wrapper).toMatchSnapshot();
  });

  test("renders pause icon when props.paused = false", () => {
    const wrapper = render(<PlayPauseButton paused={false} />);
    expect(wrapper).toMatchSnapshot();
  });

  test("Onclick triggers when user clicks the button", () => {
    const onButtonClickMock = jest.fn();
    const wrapper = shallow(<PlayPauseButton onClick={onButtonClickMock} />);
    wrapper.simulate("click");
    expect(onButtonClickMock).toHaveBeenCalledTimes(1);
  });

  test("renders play icon when props.paused = true", () => {
    const wrapper = mount(<PlayPauseButton />);
    // const button = wrapper.find('[data-test="button"]');
    const button = wrapper.find('Button');
    console.log(button.debug());
  });
});

const textContent = node => {
  try {
    // enzyme sometimes blows up on text()
    return node.text();
  } catch (_e) {
    return "";
  }
};

// useful for finding a node by its text
export const findByText = (text, wrapper, options = {}) => {
  const comparator = options.exact
    ? x => textContent(x) === text
    : x => new RegExp(text).test(textContent(x));
  return wrapper.findWhere(comparator).last();
};
