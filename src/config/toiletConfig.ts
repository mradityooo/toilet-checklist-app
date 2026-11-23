const params = new URLSearchParams(window.location.search);

const floor = params.get("floor") === "LT2" ? "LT2" : "LT1";

export const TOILET_CONFIG = {
  id: floor,
  name: `TOILET ${floor === "LT1" ? "LT 1" : "LT 2"}`,
};