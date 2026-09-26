import Layout from './components/Layout';
import { resolveRoute } from './routes';

// Three static pages don't need a router: every link is a full page load, and
// the page is picked from the path on both the server and the client.
export default function App({ path }: { path: string }) {
  const { component: Page } = resolveRoute(path);
  return (
    <Layout>
      <Page />
    </Layout>
  );
}
