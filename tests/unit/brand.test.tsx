// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { KinoraLogo, KinoraMark } from "@/components/brand/kinora-logo";
import { KinoraOrb } from "@/components/brand/kinora-orb";
import { WeatherIcon, moodMeta } from "@/components/ui/weather-icon";

describe("brand components", () => {
  it("renders the Kinora wordmark with an orb mark", () => {
    const { container } = render(<KinoraLogo />);
    expect(screen.getByText("kinora")).toBeInTheDocument();
    expect(container.querySelector("svg")).not.toBeNull();
  });

  it("renders a standalone orb mark", () => {
    const { container } = render(<KinoraMark size={32} />);
    expect(container.querySelector("svg")).not.toBeNull();
  });

  it("renders the small orb without WebGL", () => {
    const { container } = render(<KinoraOrb size={40} animated={false} />);
    expect(container.querySelector("canvas")).not.toBeNull();
    expect(container.querySelector("svg")).not.toBeNull();
  });

  it("renders each weather mood with a label and icon", () => {
    const { container } = render(
      <div>
        <WeatherIcon value="sunny" withBackground size={24} />
        <WeatherIcon value="cloudy" withBackground size={24} />
        <WeatherIcon value="rainy" withBackground size={24} />
      </div>,
    );
    expect(container.querySelectorAll("svg")).toHaveLength(3);
    expect(moodMeta("sunny").label).toBe("Sunny");
    expect(moodMeta("cloudy").label).toBe("Cloudy");
    expect(moodMeta("rainy").label).toBe("Rainy");
  });
});
