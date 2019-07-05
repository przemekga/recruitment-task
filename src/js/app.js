import "../assets/scss/app.scss";
import $ from "cash-dom";
import "isomorphic-fetch";
import "polyfill-array-includes";
import { polyfill } from "es6-promise";
import { timelineEventMarkup } from "./templates";
import { switchLoadingUIState } from "./ui";
import { formatDate, handleErrors } from "./utils";

polyfill();

export class App {
  initializeApp() {
    $(".load-username").on("submit", e => {
      e.preventDefault();
      const userName = $(".username.input").val();
      const dataLoaded = Promise.all([
        this.fetchUser(userName),
        this.fetchUserEvents(userName)
      ]);
      switchLoadingUIState();
      dataLoaded
        .then(() => {
          switchLoadingUIState();
        })
        .catch(err => {
          console.log(err);
          switchLoadingUIState();
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

  updateHistory() {
    const eventTypes = ["PullRequestEvent", "PullRequestReviewCommentEvent"];
    const filteredEvents = this.events.filter(event =>
      eventTypes.includes(event.type)
    );
    const timelineEventElements = filteredEvents
      .map(event => {
        event.created_at = formatDate(event.created_at);
        return timelineEventMarkup(event);
      })
      .join("");

    $("#user-timeline").html(timelineEventElements);
  }

  fetchUser(userName) {
    return fetch(`https://api.github.com/users/${userName}`)
      .then(handleErrors)
      .then(body => {
        this.profile = body;
        this.updateProfile();
      });
  }

  fetchUserEvents(userName) {
    return fetch(`https://api.github.com/users/${userName}/events/public`)
      .then(handleErrors)
      .then(body => {
        this.events = body;
        this.updateHistory();
      });
  }
}
