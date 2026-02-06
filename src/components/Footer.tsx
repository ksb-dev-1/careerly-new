// 3rd party
import { FaGithub } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="border-t bg-background h-16">
      <div className="w-full mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between">
        <p className="text-center sm:text-left text-sm text-slate-600 dark:text-muted-foreground">
          {/* © {new Date().getFullYear()}  */}
          Careerly. All rights reserved.
        </p>

        <div className="flex items-center gap-3 mt-4 sm:mt-0">
          <a
            href="mailto:babaleshwarkedar@gmail.com"
            className="text-slate-600 dark:text-muted-foreground hover:text-brand dark:hover:text-brand transition-colors text-sm"
            aria-label="Email kedar babaleshwar"
            title="Send email to kedar babaleshwar"
          >
            babaleshwarkedar@gmail.com
          </a>

          <span aria-hidden="true">|</span>

          <a
            href="https://github.com/ksb-dev-1"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit GitHub profile"
            title="GitHub - ksb-dev-1"
            className="text-slate-600 dark:text-muted-foreground hover:text-brand dark:hover:text-brand transition-colors"
          >
            <FaGithub className="h-5 w-5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
