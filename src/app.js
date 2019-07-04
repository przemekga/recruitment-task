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

      this.fetchUser(userName);
      this.fetchUserEvents(userName);
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
    const timelineEventElements = filteredEvents.map(event => {
      event.created_at = this.formatDate(event.created_at);
      return this.timelineEventMarkup(event);
    });
    $("#user-timeline").html(timelineEventElements.join(""));
  }

  fetchUser(userName) {
    return fetch(`https://api.github.com/users/${userName}`)
      .then(response => response.json())
      .then(body => {
        this.profile = body;
        this.updateProfile();
      });
  }

  fetchUserEvents(userName) {
    return fetch(`https://api.github.com/users/${userName}/events/public`)
      .then(response => response.json())
      .then(body => {
        this.events = body;
        this.updateHistory();
      });
  }

  timelineEventMarkup(event) {
    return `<div class="timeline-item">
      <div class="timeline-marker"></div>
      <div class="timeline-content">
        <p class="heading">${event.created_at}</p>
        <div class="content">
          <div class="gh-image">
            <img src="${event.actor.avatar_url}" />
          </div>
          <div>
            <span class="gh-username">
              <a href="https://github.com/${event.actor.display_login}">${
      event.actor.display_login
    }</a>
            </span>
            ${this.getEventMessage(event)}
            <p class="repo-name">
              <a href="https://github.com/${event.repo.name}">${
      event.repo.name
    }</a>
            </p>
          </div>
        </div>
      </div>
    </div>`;
  }

  getEventMessage(event) {
    switch (event.type) {
      case "PullRequestEvent":
        return `
          <span class="gh-status">${event.payload.action}</span>
          <a href="${event.payload.pull_request.html_url}">pull request</a>`;
      case "PullRequestReviewCommentEvent":
        return `
          <span class="gh-status">${event.payload.action}</span>
          <a href="${event.payload.comment.html_url}">comment</a> to
          <a href="${event.payload.pull_request.html_url}">pull request</a>`;
      default:
        return `<span class="gh-status">did ${event.type
          .replace("Event", "")
          .toLowerCase()}</span>`;
    }
  }

  formatDate(date) {
    return new Date(date).toLocaleDateString(["en-US"], {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  }
}
