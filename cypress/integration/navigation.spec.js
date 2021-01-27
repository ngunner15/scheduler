describe("Navigation", () => {
  it("should visit root", () => {
    cy.visit("/");
  });

  it("should navigate to Tuesday", () => {
    cy.get("li").contains("Tuesday").click();
    cy.get("li")
      .contains("Tuesday")
      .should("have.css", "background-color", "rgb(242, 242, 242)");
  });
});