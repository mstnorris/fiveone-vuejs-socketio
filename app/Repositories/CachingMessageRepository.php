<?php namespace SomethingGoodHappenedToday\Repositories;

use Illuminate\Contracts\Cache\Repository as Cache;

class CachingMessageRepository implements MessageRepository {

    private $repository;

    private $cache;

    public function __construct(MessageRepository $repository, Cache $cache)
    {
        $this->repository = $repository;
        $this->cache = $cache;
    }

    public function getAll()
    {
        return $this->cache->remember('messages.all', 1, function() {
            return $messages = $this->repository->getAll();
        });

    }

    public function show($id)
    {
        return $this->cache->remember('messages.show', 1, function() use ($id) {
            return $message = $this->repository->show($id);
        });
    }
}