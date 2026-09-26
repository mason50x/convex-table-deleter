import LegalPage, { ContactLine } from '../components/LegalPage';
import { site } from '../site';

export default function Terms() {
  return (
    <LegalPage title="Terms of Service">
      <p>
        These Terms of Service (“Terms”) govern your use of the {site.name} Chrome extension (the
        “Extension”) and this website (the “Site”), provided by {site.company} (“we”, “us”). By
        installing or using the Extension or the Site, you agree to these Terms. If you do not
        agree, do not use them.
      </p>

      <h2>1. Open-source license</h2>
      <p>
        The Extension’s source code is available under the{' '}
        <a href={`${site.repoUrl}/blob/main/LICENSE`}>MIT License</a>. Nothing in these Terms
        limits the rights that license grants you over the source code. These Terms cover your use
        of the Extension as we distribute it and of the Site.
      </p>

      <h2>2. What the Extension does</h2>
      <p>
        The Extension adds buttons to the Convex dashboard at{' '}
        <code>https://{site.dashboardHost}/</code> that delete tables not defined in your schema,
        by operating the dashboard’s own delete flow for you. It acts only when you click to
        confirm, and only with the permissions your Convex account already has.
      </p>

      <h2>3. Deletions are permanent</h2>
      <p>
        <strong>Deleting a table permanently destroys its data.</strong> Neither we nor the
        Extension can undo a deletion. You are solely responsible for:
      </p>
      <ul>
        <li>reviewing which tables are selected before you confirm a delete;</li>
        <li>keeping backups of any data you may need; and</li>
        <li>
          taking extra care with production deployments, which the Extension treats the same as
          any other.
        </li>
      </ul>
      <p>
        The Extension relies on the structure of the Convex dashboard, which Convex may change at
        any time. A change could cause the Extension to stop working or to behave unexpectedly.
        Stop using it if anything looks wrong, and please report it.
      </p>

      <h2>4. Your use</h2>
      <p>
        You may use the Extension only on Convex projects you are authorized to manage, and in
        compliance with Convex, Inc.’s terms of service and any applicable law. You may not use it
        to interfere with or gain unauthorized access to any service or data.
      </p>

      <h2>5. No affiliation</h2>
      <p>
        {site.name} is an unofficial, independent tool. It is not affiliated with, sponsored by, or
        endorsed by Convex, Inc. “Convex” and related names and logos are trademarks of their
        respective owners and are used only to describe what the Extension works with.
      </p>

      <h2>6. No warranty</h2>
      <p>
        THE EXTENSION AND THE SITE ARE PROVIDED “AS IS” AND “AS AVAILABLE”, WITHOUT WARRANTY OF ANY
        KIND, EXPRESS OR IMPLIED, INCLUDING ANY WARRANTY OF MERCHANTABILITY, FITNESS FOR A
        PARTICULAR PURPOSE, NON-INFRINGEMENT, OR THAT THEY WILL BE ERROR-FREE OR UNINTERRUPTED.
      </p>

      <h2>7. Limitation of liability</h2>
      <p>
        TO THE FULLEST EXTENT PERMITTED BY LAW, {site.company.toUpperCase()} AND ITS MEMBERS,
        EMPLOYEES, AND CONTRIBUTORS WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
        CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR FOR ANY LOSS OF DATA, PROFITS, OR BUSINESS, ARISING
        OUT OF OR RELATING TO YOUR USE OF THE EXTENSION OR THE SITE, EVEN IF ADVISED OF THE
        POSSIBILITY OF SUCH DAMAGES. OUR TOTAL LIABILITY FOR ANY CLAIM RELATING TO THE EXTENSION OR
        THE SITE WILL NOT EXCEED US $50.
      </p>

      <h2>8. Indemnity</h2>
      <p>
        You agree to indemnify and hold {site.company} harmless from any claim arising from your
        misuse of the Extension or your violation of these Terms or of any third party’s terms,
        including Convex, Inc.’s.
      </p>

      <h2>9. Changes and termination</h2>
      <p>
        We may update the Extension, the Site, or these Terms at any time. When we change these
        Terms we will update the effective date above; continuing to use the Extension after that
        means you accept the updated Terms. We may stop distributing the Extension at any time. You
        can stop using it at any time by uninstalling it.
      </p>

      <h2>10. Governing law</h2>
      <p>
        These Terms are governed by the laws of {site.governingLaw}, without regard to its
        conflict-of-laws rules. If any provision is found unenforceable, the rest remain in effect.
      </p>

      <h2>11. Contact</h2>
      <p>
        Questions about these Terms? <ContactLine />.
      </p>
    </LegalPage>
  );
}
