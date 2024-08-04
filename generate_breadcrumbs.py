import yaml

def build_breadcrumbs(menu, parent_breadcrumbs=None):
    if parent_breadcrumbs is None:
        parent_breadcrumbs = []

    breadcrumbs_map = {}

    for item in menu:
        current_breadcrumbs = parent_breadcrumbs + [{'title': item['title'], 'url': item['url']}]

        if 'submenu' in item:
            breadcrumbs_map.update(build_breadcrumbs(item['submenu'], current_breadcrumbs))

        if 'contents' in item['url']:
            # 将全路径处理后作为键名，保证唯一。
            key = '_'.join(item['url'].strip('/').split('/')[0:-1])
            if key:
                breadcrumbs_map[key] = current_breadcrumbs

    return breadcrumbs_map

def main():
    with open('_data/navigation.yaml', 'r', encoding='utf-8') as file:
        navigation_data = yaml.safe_load(file)

    breadcrumbs = build_breadcrumbs(navigation_data)

    with open('_data/breadcrumbs.yml', 'w', encoding='utf-8') as file:
        yaml.dump(breadcrumbs, file, allow_unicode=True)

if __name__ == "__main__":
    main()
