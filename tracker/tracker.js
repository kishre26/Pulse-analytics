/**
 * Pulse Analytics tracker
 *
 * Embed on any page you want to measure:
 *
 *   <script
 *     src="https://your-api-domain.com/tracker.js"
 *     data-site-id="YOUR_SITE_ID"
 *     data-api="https://your-api-domain.com/api/collect"
 *     defer
 *   ></script>
 */
(function () {
  var script = document.currentScript;
  if (!script) return;

  var siteId = script.getAttribute("data-site-id");
  var apiUrl = script.getAttribute("data-api");

  if (!siteId || !apiUrl) {
    console.warn("Pulse tracker: missing data-site-id or data-api attribute");
    return;
  }

  function send() {
    var payload = JSON.stringify({
      siteId: siteId,
      url: window.location.href,
      referrer: document.referrer || "",
    });

    fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
      credentials: "omit",
    }).catch(function () {});
  }

  send();

  // Re-fire on client-side route changes for single-page apps
  var pushState = history.pushState;
  history.pushState = function () {
    pushState.apply(history, arguments);
    send();
  };
  window.addEventListener("popstate", send);
})();