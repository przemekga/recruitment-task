import $ from "cash-dom";

export function switchLoadingUIState() {
  $(".loader, .profile-container, .events-container").toggleClass("is-hidden");
}
