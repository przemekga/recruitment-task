import "./assets/scss/app.scss";
import $ from "cash-dom";
import "isomorphic-fetch";
import { polyfill } from "es6-promise";

polyfill();

export class App {
  initializeApp() {
    $(".load-username").on("submit", e => {
      e.preventDefault();

      const userName = $(".username.input").val();

      fetch(`https://api.github.com/users/${userName}`)
        .then(response => response.json())
        .then(body => {
          this.profile = body;
          this.updateProfile();
        });
    });
  }

  updateProfile() {
    $("#profile-name").text($(".username.input").val());
    $("#profile-image").attr("src", this.profile.avatar_url);
    $("#profile-url")
      .attr("href", this.profile.html_url)
      .text(this.profile.login);
    $("#profile-bio").text(this.profile.bio || "(no information)");
  }
}
