import LegalPage, { ContactLine } from '../components/LegalPage';
import { site } from '../site';

export default function Privacy() {
  return (
    <LegalPage title="Privacy Policy">
      <p>
        This Privacy Policy explains how {site.company} (“we”, “us”) handles information in
        connection with the {site.name} Chrome extension (the “Extension”) and this website (the
        “Site”).
      </p>

      <p>
        <strong>The short version:</strong> the Extension does not collect, store, or transmit any
        personal data or any other data. It has no analytics, no tracking, no accounts, and makes no
        network requests of its own. Everything it does happens locally in your browser.
      </p>

      <h2>What the Extension accesses</h2>
      <p>
        The Extension runs only on pages under <code>https://{site.dashboardHost}/</code>, the
        Convex dashboard. While you use the dashboard, it reads the page that is already displayed
        in your browser to:
      </p>
      <ul>
        <li>find the names of the tables listed on the Data page;</li>
        <li>tell which tables are in your schema and which are not (the ones marked “*”); and</li>
        <li>
          when you ask it to delete a table, click through the dashboard’s own delete menu and
          confirmation dialog on your behalf.
        </li>
      </ul>
      <p>
        This information is used only in the moment, to show the Extension’s buttons and carry out
        the deletions you confirm. It is never saved, never leaves your browser, and is never sent
        to us or to anyone else. The Extension does not read your table contents, your Convex
        credentials, or anything on any other website.
      </p>

      <h2>Permissions</h2>
      <p>
        The Extension requests no Chrome permissions beyond a content script that runs on{' '}
        <code>https://{site.dashboardHost}/*</code>. It does not use the storage, cookies, tabs,
        history, or network-request APIs, and it does not load or execute any remote code.
      </p>

      <h2>Information we collect</h2>
      <p>
        None. We do not collect, sell, rent, or share any personal information or usage data from
        the Extension, because the Extension does not gather any in the first place.
      </p>

      <h2>This website</h2>
      <p>
        The Site uses no cookies, analytics, advertising, or third-party scripts or fonts. Like any
        website, the service hosting it may automatically log standard technical information such
        as your IP address, browser type, and the pages requested, for security and to keep the Site
        running. We do not use that information to identify you or combine it with anything else.
      </p>

      <h2>Third-party services</h2>
      <p>
        Your use of the Convex dashboard is governed by Convex, Inc.’s own terms and privacy policy;
        the Extension does not change what Convex collects. Installing the Extension from the Chrome
        Web Store is governed by Google’s privacy policy. If you open an issue or pull request on
        GitHub, the information you post there is public and governed by GitHub’s privacy policy.
      </p>

      <h2>Chrome Web Store User Data Policy</h2>
      <p>
        The Extension’s use of information complies with the{' '}
        <a href="https://developer.chrome.com/docs/webstore/program-policies/policies">
          Chrome Web Store User Data Policy
        </a>
        , including its Limited Use requirements. Specifically, we do not transfer or sell user
        data to third parties, do not use or transfer it for purposes unrelated to the Extension’s
        single purpose, and do not use or transfer it to determine creditworthiness or for lending.
      </p>

      <h2>Children</h2>
      <p>
        The Extension is a developer tool and is not directed at children under 13. Since we collect
        no data, we do not knowingly collect information from children.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        If a future version of the Extension changes how it handles data, we will update this
        policy and its effective date before that version is released. Material changes will also be
        noted in the project’s release notes.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this policy? <ContactLine />.
      </p>
    </LegalPage>
  );
}
