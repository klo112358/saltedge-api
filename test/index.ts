// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config()

import chai, { expect } from "chai"
import chaiThings from "chai-things"
import chaiPromise from "chai-as-promised"

chai.should()
chai.use(chaiThings)
chai.use(chaiPromise)

describe("Test", () => {
  it("should be equal", async () => {
  })
})
