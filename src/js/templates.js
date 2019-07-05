export function timelineEventMarkup(event) {
  return `
    <div class="timeline-item">
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
            ${getEventMessage(event)}
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

function getEventMessage(event) {
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
